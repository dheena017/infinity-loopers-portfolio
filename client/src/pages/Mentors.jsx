import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { mentorData as localMentors } from '../data/team';
import ProfileCard from '../components/ProfileCard';
import { Briefcase, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
            if (!supabase) throw new Error('Database unavailable');
            
            let result;
            if (type === 'mentor') {
                const { data, error } = await supabase.from('mentors').insert([{ name, role, desc, photo, email }]).select();
                if (error) throw error;
                onCreate(data[0]);
            } else if (type === 'student') {
                const { data, error } = await supabase.from('students').insert([{ name, role, email, photo, bio: desc, term }]).select();
                if (error) throw error;
                onCreate(data[0]);
            } else if (type === 'teacher') {
                const { data, error } = await supabase.from('secretaries').insert([{ name, role, email, photo, bio: desc }]).select();
                if (error) throw error;
                onCreate(data[0]);
            }
            // reset
            setName(''); setRole('Advisor'); setEmail(''); setPhoto(''); setDesc(''); setTerm('');
        } catch (err) {
            console.error(err);
            alert('Create failed: ' + err.message);
        } finally { setBusy(false); }
    };

    return (
        <form onSubmit={submit} className="panel-card p-6 mb-8">
            <div className="flex gap-4 mb-4">
                <select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded">
                    <option value="mentor">Mentor</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="flex-1 p-2 border rounded" />
                <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role" className="w-56 p-2 border rounded" />
            </div>
            <div className="flex gap-4 mb-4">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="flex-1 p-2 border rounded" />
                <input value={photo} onChange={e => setPhoto(e.target.value)} placeholder="Photo URL" className="flex-1 p-2 border rounded" />
                <input value={term} onChange={e => setTerm(e.target.value)} placeholder="Term (students)" className="w-56 p-2 border rounded" />
            </div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Bio / Desc" className="w-full p-2 border rounded mb-4"></textarea>
            <div className="flex justify-end">
                <button type="submit" disabled={busy} className="px-4 py-2 bg-red-600 text-white rounded">{busy ? 'Creating...' : 'Create'}</button>
            </div>
        </form>
    );
};

const Mentors = () => {
    const [mentors, setMentors] = useState(localMentors);

    const [searchParams] = useSearchParams();
    const isAdmin = searchParams.get('admin') === 'true';

    // Intentionally using only local mentor data for display.

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
                            Professional Guidance
                        </div>
                        <h2 className="section-heading">Our <span className="text-red-500">Mentor</span> Network</h2>
                        <p className="section-copy max-w-lg">
                            Dedicated professionals committed to shaping the next generation through clarity, technical expertise, and real-world wisdom.
                        </p>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="panel-card p-8 lg:p-10 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4 text-slate-200">
                            <Star size={20} className="text-amber-500" />
                            <span className="font-bold text-lg heading-display">Community-Driven Mentorship</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Our mentors focus on hands-on development, structured thinking, and building communication confidence.
                        </p>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span>Human Centeric</span>
                            <span>Growth Focused</span>
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
                                role: mentor.role || 'Mentor',
                                bio: mentor.bio || mentor.desc || '',
                                expertise: mentor.expertise || '',
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
