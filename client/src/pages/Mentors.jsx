import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import ProfileCard from '../components/ProfileCard';
import { Briefcase, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { mentorData, teamData } from '../data/team';

// Admin form component
const AdminForm = ({ onCreate, onUpdate, editingMentor, onCancelEdit }) => {
    const [type, setType] = useState('mentor');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Advisor');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [desc, setDesc] = useState('');
    const [term, setTerm] = useState('');
    const [busy, setBusy] = useState(false);

    const isEditingMentor = Boolean(editingMentor?.id);

    useEffect(() => {
        if (!isEditingMentor) return;
        setType('mentor');
        setName(editingMentor.name || '');
        setRole(editingMentor.role || 'Advisor');
        setEmail(editingMentor.email || '');
        setPhoto(editingMentor.photo || '');
        setDesc(editingMentor.desc || editingMentor.bio || '');
        setTerm('');
    }, [editingMentor, isEditingMentor]);

    const resetForm = () => {
        setName('');
        setRole('Advisor');
        setEmail('');
        setPhoto('');
        setDesc('');
        setTerm('');
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!name) return alert('Name required');
        setBusy(true);
        try {
            if (type === 'mentor') {
                let savedMentor = null;

                if (!supabase) {
                    throw new Error('Mentor save failed: Supabase not configured');
                }

                const basePayload = { name, role, description: desc, photo };

                let result;
                if (isEditingMentor) {
                    result = await supabase
                        .from('mentors')
                        .update({ ...basePayload, email })
                        .eq('id', editingMentor.id)
                        .select()
                        .single();

                    if (result.error?.message?.toLowerCase().includes('email')) {
                        result = await supabase
                            .from('mentors')
                            .update(basePayload)
                            .eq('id', editingMentor.id)
                            .select()
                            .single();
                    }
                } else {
                    result = await supabase
                        .from('mentors')
                        .insert([{ ...basePayload, email }])
                        .select()
                        .single();

                    if (result.error?.message?.toLowerCase().includes('email')) {
                        result = await supabase
                            .from('mentors')
                            .insert([basePayload])
                            .select()
                            .single();
                    }
                }

                if (result.error) {
                    throw result.error;
                }

                savedMentor = result.data;

                if (isEditingMentor) {
                    onUpdate(savedMentor);
                    onCancelEdit();
                } else {
                    onCreate(savedMentor);
                }
            } else if (type === 'student') {
                if (!supabase) throw new Error('Database unavailable');
                const { data, error } = await supabase.from('students').insert([{ name, role, email, photo, bio: desc, term }]).select();
                if (error) throw error;
                onCreate(data[0]);
            }
            resetForm();
        } catch (err) {
            console.error(err);
            alert(`${isEditingMentor ? 'Update' : 'Create'} failed: ` + err.message);
        } finally { setBusy(false); }
    };

    return (
        <form onSubmit={submit} className="panel-card p-6 mb-8">
            <div className="flex gap-4 mb-4">
                <select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded" disabled={isEditingMentor}>
                    <option value="mentor">Mentor</option>
                    <option value="student">Student</option>
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
                {isEditingMentor && (
                    <button
                        type="button"
                        onClick={() => {
                            onCancelEdit();
                            resetForm();
                        }}
                        className="px-4 py-2 bg-slate-700 text-white rounded mr-2"
                    >
                        Cancel Edit
                    </button>
                )}
                <button type="submit" disabled={busy} className="px-4 py-2 bg-red-600 text-white rounded">{busy ? (isEditingMentor ? 'Saving...' : 'Creating...') : (isEditingMentor ? 'Save Mentor' : 'Create')}</button>
            </div>
        </form>
    );
};

const Mentors = ({ user }) => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingMentor, setEditingMentor] = useState(null);

    const normalizedEmail = user?.email?.trim().toLowerCase();
    const coreLeadershipEmails = new Set([
        ...teamData.map(member => member?.email?.trim().toLowerCase()).filter(Boolean),
        'mohamed.sharaf.s.139@kalvium.community',
        'imran.s.s.139@kalvium.community',
        'nayeem.sajjath.s.139@kalvium.community'
    ]);
    const canManageMembers = coreLeadershipEmails.has(normalizedEmail);
    const defaultMentorBios = {
        'santusha iyer': 'Guides learners through strong front-end foundations and practical engineering concepts with real-world clarity.'
    };

    const resolveMentorBio = (mentor) => {
        const rawBio = mentor?.bio || mentor?.desc || mentor?.description || '';
        const normalizedName = (mentor?.name || '').trim().toLowerCase();
        const defaultBio = defaultMentorBios[normalizedName] || '';
        const looksCorrupted = /\[[^\]]*$|\[.*\[|[^\w\s.,'"&()\-:/]/.test(rawBio);

        if (!rawBio || looksCorrupted) {
            return defaultBio || rawBio;
        }

        return rawBio;
    };

    const mergeWithLocalMentors = (remoteMentors = []) => {
        const safeRemote = Array.isArray(remoteMentors) ? remoteMentors : [];
        const merged = [...safeRemote];
        const seenNames = new Set(
            safeRemote
                .map((item) => (item?.name || '').trim().toLowerCase())
                .filter(Boolean)
        );

        for (const localMentor of mentorData) {
            const nameKey = (localMentor?.name || '').trim().toLowerCase();
            if (nameKey && !seenNames.has(nameKey)) {
                merged.push(localMentor);
            }
        }

        return merged;
    };

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                setError('');
                if (!supabase) {
                    throw new Error('Mentor data unavailable (Supabase not configured)');
                }

                const { data, error: supabaseError } = await supabase
                    .from('mentors')
                    .select('*')
                    .order('id', { ascending: true });

                if (supabaseError) {
                    throw new Error(supabaseError.message || 'Failed to fetch mentors from Supabase');
                }

                setMentors(mergeWithLocalMentors(data));
                setError('');
            } catch (fetchError) {
                console.warn('Failed to load mentors:', fetchError?.message || fetchError);
                setMentors(mergeWithLocalMentors([]));
                setError('');
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
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
                {canManageMembers && (
                    <AdminForm
                        onCreate={(newItem) => setMentors(prev => [newItem, ...prev])}
                        onUpdate={(updatedMentor) => setMentors(prev => prev.map(item => item.id === updatedMentor.id ? updatedMentor : item))}
                        editingMentor={editingMentor}
                        onCancelEdit={() => setEditingMentor(null)}
                    />
                )}

                {/* Mentors List (ProfileCard style) */}
                <div className="grid grid-cols-1 gap-12">
                    {loading && (
                        <div className="panel-card p-6 text-center text-slate-400">Loading mentors...</div>
                    )}
                    {!loading && error && (
                        <div className="panel-card p-6 text-center text-red-400">{error}</div>
                    )}
                    {!loading && !error && mentors.length === 0 && (
                        <div className="panel-card p-6 text-center text-slate-400">No mentors found in database.</div>
                    )}
                    {mentors.map((mentor, idx) => (
                        <div key={`${mentor.id ?? 'mentor'}-${mentor.name ?? idx}`}>
                            {canManageMembers && (
                                <div className="flex justify-end mb-3">
                                    <button
                                        onClick={() => setEditingMentor(mentor)}
                                        className="px-3 py-1.5 text-xs font-bold rounded bg-slate-800 hover:bg-slate-700 text-slate-100"
                                    >
                                        Edit Mentor
                                    </button>
                                </div>
                            )}
                            <ProfileCard
                                member={{
                                    id: mentor.id,
                                    name: mentor.name,
                                    role: mentor.role || 'Mentor',
                                    bio: resolveMentorBio(mentor),
                                    expertise: mentor.expertise || '',
                                    github: mentor.github || '',
                                    linkedin: mentor.linkedin || mentor.LinkedIn || mentor.LINKEDIN || '',
                                    email: mentor.email || mentor.Email || mentor.EMAIL || '',
                                    photo: mentor.photo || '/assets/mentor1.jpg',
                                    focusLink: mentor.focusLink || mentor.focus_link || ''
                                }}
                                alternate={idx % 2 !== 0}
                                badge="Mentor Profile"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mentors;
