import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ShieldAlert, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TeacherDashboard = ({ user, onUpdate }) => {
    const [profileForm, setProfileForm] = useState({
        name: user?.username || '',
        photo: user?.photo || '',
        email: user?.email || '',
        bio: user?.bio || ''
    });
    const [profileSaving, setProfileSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleProfileSave = async () => {
        setProfileSaving(true);
        try {
            if (!user?.id) {
                throw new Error('Mentor session not found. Please login again.');
            }

            if (!supabase) {
                throw new Error('Database connection lost. Please try again.');
            }

            const { data: updatedData, error: updateError } = await supabase
                .from('mentors')
                .update({
                    name: profileForm.name,
                    photo: profileForm.photo,
                    email: profileForm.email,
                    bio: profileForm.bio,
                    description: profileForm.bio // Ensure both bio and description are synced
                })
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) throw updateError;

            const updatedMentor = updatedData || {};

            if (onUpdate) {
                onUpdate({
                    username: updatedMentor.name || profileForm.name,
                    photo: updatedMentor.photo || profileForm.photo,
                    email: updatedMentor.email || profileForm.email,
                    bio: updatedMentor.bio || updatedMentor.desc || profileForm.bio
                });
                setSaveMessage('PROFILE UPDATE: SUCCESS');
                setTimeout(() => {
                    setSaveMessage('');
                }, 1500);
            }
        } catch (error) {
            setSaveMessage(error?.message || 'ERROR: UPDATE FAILED');
        } finally {
            setProfileSaving(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <section className="section-shell px-4 py-20 flex items-center justify-center min-h-screen">
            <Motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-3xl mx-auto"
            >
                <div className="flex flex-col items-center mb-20 text-center space-y-10">
                    <div className="p-8 rounded-full bg-red-500/10 border border-red-500/20">
                        <ShieldAlert className="text-red-500 w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black heading-display text-white italic">Mentor Console</h1>
                        <p className="text-xs text-slate-500 mt-6 uppercase tracking-[0.2em] font-bold">Secure Command Terminal</p>
                    </div>
                </div>

                <div className="premium-card p-24 bg-slate-900 border border-white/10 overflow-hidden shadow-2xl relative">
                    <div className="space-y-16">
                        <div className="flex items-center gap-10 p-8 bg-slate-950 rounded-2xl border border-white/5">
                            <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 shrink-0 shadow-lg">
                                <img
                                    src={profileForm.photo || user?.photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${profileForm.name}&background=1e293b&color=fff&size=512`; }}
                                />
                            </div>
                            <div className="flex-1 space-y-6">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Avatar URL</label>
                                <input
                                    value={profileForm.photo}
                                    onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })}
                                    className="w-full bg-slate-900 border border-white/5 rounded-2xl p-8 text-xs text-white focus:border-red-500 outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Display Name</label>
                            <input
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-8 text-xs text-white focus:border-red-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-6">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Email</label>
                            <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-8 text-xs text-white focus:border-red-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-6">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 pl-2">
                                Bio / Directive
                            </label>
                            <textarea
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-8 text-xs text-white focus:border-red-500 outline-none h-40 resize-none transition-all"
                                placeholder="Enter command directive..."
                            />
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <button
                            onClick={handleProfileSave}
                            disabled={profileSaving}
                            className="w-full flex items-center justify-center gap-4 py-8 bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs tracking-[0.2em] rounded-3xl shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02]"
                        >
                            {profileSaving ? 'Updating...' : <><Save size={20} /> Update Profile</>}
                        </button>
                    </div>

                    {saveMessage && (
                        <div className="absolute inset-x-0 bottom-0 py-2 bg-emerald-500/10 text-emerald-400 text-center text-[10px] font-bold uppercase tracking-widest">
                            {saveMessage}
                        </div>
                    )}
                </div>
            </Motion.div>
        </section>
    );
};

export default TeacherDashboard;
