import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { mentorData as localMentors } from '../data/team';
import ProfileCard from '../components/ProfileCard';
import { Briefcase, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

// Admin form component
const AdminForm = ({ onCreate }) => {
    const [type, setType] = useState('mentor');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Advisor');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [desc, setDesc] = useState('');
    const [term, setTerm] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!name) return alert('Name required');
        setBusy(true);
        try {
            if (type === 'mentor') {
                const res = await fetch('/api/mentors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role, desc, photo, email }) });
                const payload = await res.json();
                onCreate(payload.data);
            } else if (type === 'student') {
                const res = await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role, email, photo, bio: desc, term }) });
                const payload = await res.json();
                onCreate(payload.data);
            } else if (type === 'teacher') {
                // Reuse secretaries endpoint as teacher placeholder
                const res = await fetch('/api/secretaries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role, email, photo, bio: desc }) });
                const payload = await res.json();
                onCreate(payload.data);
            }
            // reset
            setName(''); setRole('Advisor'); setEmail(''); setPhoto(''); setDesc(''); setTerm('');
        } catch (err) {
            console.error(err);
            alert('Create failed');
        } finally { setBusy(false); }
    };

    return (
        <form onSubmit={submit} className="panel-card p-6 mb-8">
            <div className="flex gap-4 mb-4">
                <select value={type} onChange={e=>setType(e.target.value)} className="p-2 border rounded">
                    <option value="mentor">Mentor</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="flex-1 p-2 border rounded" />
                <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role" className="w-56 p-2 border rounded" />
            </div>
            <div className="flex gap-4 mb-4">
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="flex-1 p-2 border rounded" />
                <input value={photo} onChange={e=>setPhoto(e.target.value)} placeholder="Photo URL" className="flex-1 p-2 border rounded" />
                <input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Term (students)" className="w-56 p-2 border rounded" />
            </div>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Bio / Desc" className="w-full p-2 border rounded mb-4"></textarea>
            <div className="flex justify-end">
                <button type="submit" disabled={busy} className="px-4 py-2 bg-red-600 text-white rounded">{busy? 'Creating...' : 'Create'}</button>
            </div>
        </form>
    );
};

const Mentors = () => {
    const [mentors, setMentors] = useState(localMentors);
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const isAdmin = searchParams.get('admin') === 'true';

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch('/api/mentors')
            .then((r) => r.json())
            .then((payload) => {
                if (cancelled) return;
                if (payload && payload.success && Array.isArray(payload.data)) {
                    setMentors(payload.data);
                }
            })
            .catch((err) => {
                console.warn('Mentors fetch failed, using local data:', err);
            })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, []);

    return (
        <section className="section-shell">
            <div className="section-stack md:space-y-28">

                {/* Section Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-widest">
                            <Briefcase size={14} />
                            Advisory Leadership
                        </div>
                        <h2 className="section-heading">Board of <br /><span className="text-red-500">Advisors</span></h2>
                        <p className="section-copy max-w-lg">
                            Experienced industry leaders providing strategic direction and technical architectural oversight.
                        </p>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="panel-card p-8 lg:p-10 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4 text-slate-200">
                            <Star size={20} className="text-amber-500" />
                            <span className="font-bold text-lg heading-display">Mentor Network</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Our mentors bring deep domain expertise across systems, security, and product strategy.
                        </p>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span>Trusted Advisors</span>
                            <span>Community Verified</span>
                        </div>
                    </Motion.div>
                </div>

                {/* Admin Form (only visible when ?admin=true) */}
                {isAdmin && <AdminForm onCreate={(newItem) => setMentors(prev => [newItem, ...prev])} />}

                {/* Mentors List (ProfileCard style) */}
                <div className="grid grid-cols-1 gap-12">
                    {mentors.map((mentor, idx) => (
                        <ProfileCard
                            key={mentor.id}
                            member={{
                                id: mentor.id,
                                name: mentor.name,
                                role: mentor.role || 'Advisor',
                                bio: mentor.desc || '',
                                github: mentor.github || '',
                                linkedin: mentor.linkedin || '',
                                email: mentor.email || '',
                                photo: mentor.photo || '/assets/mentor1.jpg'
                            }}
                            alternate={idx % 2 !== 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mentors;
