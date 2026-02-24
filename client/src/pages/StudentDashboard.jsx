import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    User, Edit3, Save, X, Github, Linkedin, MessageSquare, 
    Shield, Cpu, Activity, Layout, Camera, Lock, Eye, EyeOff, 
    CheckCircle2, AlertCircle, Home, Crown, GraduationCap, 
    Briefcase, LogOut, Menu, Grip, Globe 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const StudentDashboard = ({ user, onUpdate, onLogout }) => {
    const [studentData, setStudentData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: '',
        tagline: '',
        bio: '',
        linkedin: '',
        github: '',
        photo: '',
        resume_url: ''
    });
    const [message, setMessage] = useState('');
    const [archives, setArchives] = useState([]);

    // ── Change Password state ──────────────────────────────
    const [showPasswordPanel, setShowPasswordPanel] = useState(false);
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [pwMessage, setPwMessage] = useState({ text: '', type: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!user?.studentId) {
                setLoading(false);
                return;
            }
            try {
                if (!supabase) throw new Error('Database unavailable');
                const { data, error } = await supabase
                    .from('students')
                    .select('*')
                    .eq('id', user.studentId)
                    .single();
                
                if (error) throw error;
                
                setStudentData(data);
                setForm({
                    name: data.name || '',
                    tagline: data.tagline || '',
                    bio: data.bio || '',
                    linkedin: data.linkedin || '',
                    github: data.github || '',
                    photo: data.photo || '',
                    resume_url: data.resume_url || ''
                });
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchArchives = async () => {
            try {
                if (!supabase) return;
                const { data, error } = await supabase
                    .from('archives')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (!error && data) setArchives(data);
            } catch (err) {
                console.error('Archives error:', err);
            }
        };

        fetchStudent();
        fetchArchives();
    }, [user]);

    const handleSave = async () => {
        setMessage('SYNCING...');
        try {
            if (!supabase) throw new Error('Database unavailable');
            const { data, error } = await supabase
                .from('students')
                .update(form)
                .eq('id', user.studentId)
                .select();
            
            if (error) throw error;
            
            const saved = data[0] || form;
            setStudentData(prev => ({ ...prev, ...saved }));

            if (onUpdate) {
                const userUpdates = {};
                if (form.name && form.name !== user.username) userUpdates.username = form.name;
                if (form.photo && form.photo !== user.photo) userUpdates.photo = form.photo;
                if (Object.keys(userUpdates).length > 0) onUpdate(userUpdates);
            }

            setMessage('UPDATED');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.message || 'OFFLINE');
        }
    };

    const handleChangePassword = async () => {
        setPwMessage({ text: '', type: '' });
        if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
            return setPwMessage({ text: 'All fields required.', type: 'error' });
        }
        if (pwForm.newPw !== pwForm.confirm) {
            return setPwMessage({ text: 'Passwords do not match.', type: 'error' });
        }
        if (pwForm.newPw.length < 6) {
            return setPwMessage({ text: 'Min 6 characters.', type: 'error' });
        }
        setPwLoading(true);
        try {
            if (!supabase) throw new Error('Database unavailable');
            
            // First verify current password
            const { data: student } = await supabase
                .from('students')
                .select('password')
                .eq('id', user.studentId)
                .single();
            
            if (student?.password !== pwForm.current) {
                setPwMessage({ text: 'Current password incorrect.', type: 'error' });
                setPwLoading(false);
                return;
            }
            
            // Update password
            const { error } = await supabase
                .from('students')
                .update({ password: pwForm.newPw })
                .eq('id', user.studentId);
            
            if (error) throw error;
            
            setPwMessage({ text: 'Password changed.', type: 'success' });
            setPwForm({ current: '', newPw: '', confirm: '' });
            setTimeout(() => { setShowPasswordPanel(false); setPwMessage({ text: '', type: '' }); }, 2500);
        } catch (err) {
            setPwMessage({ text: err.message || 'Server error.', type: 'error' });
        } finally {
            setPwLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="w-10 h-10 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-red-500/30 pt-32 md:pt-40 lg:pt-48 xl:pt-56 relative z-0">
            {/* Spacer for fixed header */}
            <div className="h-20 lg:h-24 w-full"></div>

            <div className="flex max-w-[1600px] mx-auto">
                
                {/* ── Main Content ── */}
                <main className="flex-1 p-6 lg:p-10 min-w-0">
                    <div className="max-w-5xl mx-auto space-y-8">
                        
                        {/* Header Banner */}
                        <div className="relative rounded-3xl bg-slate-900 overflow-hidden shadow-2xl shadow-black/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 to-slate-900/40"></div>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            
                            <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                                <div className="space-y-4 max-w-xl">
                                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                        {studentData?.name || user.username}
                                    </h1>
                                    <p className="text-slate-300 text-lg font-medium">
                                        "{studentData?.tagline || 'Ready for your next mission, Operative?'}"
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-all">Cancel</button>
                                            <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-900/20 transition-all flex items-center gap-2">
                                                Save Changes
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-red-50 font-bold text-sm shadow-xl transition-all flex items-center gap-2 group">
                                            Modify Interface
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {message && (
                            <Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 font-bold text-sm">
                                {message}
                            </Motion.div>
                        )}

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Left Column: Profile & Stats */}
                            <div className="space-y-8">
                                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group backdrop-blur-md">
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-800"></div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative w-28 h-28 mb-4">
                                            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full"></div>
                                            <img
                                                src={isEditing ? form.photo : studentData?.photo}
                                                alt="Profile"
                                                className="relative w-full h-full rounded-2xl object-cover border-4 border-slate-700/50 shadow-xl"
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=0f172a&color=fff`; }}
                                            />
                                            {isEditing && (
                                                <div className="absolute -bottom-2 -right-2 bg-red-600 p-2 rounded-lg shadow-lg hover:bg-red-500 transition-colors cursor-pointer">
                                                    <Camera size={16} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-white mb-1">{user.username}</h3>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                                            Active Operative
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full mt-6">
                                            {[
                                                { icon: Linkedin, color: 'text-red-400', bg: 'hover:bg-red-400/10', link: studentData?.linkedin },
                                                { icon: Github, color: 'text-white', bg: 'hover:bg-slate-700', link: studentData?.github },
                                                { icon: Briefcase, color: 'text-red-400', bg: 'hover:bg-red-400/10', link: studentData?.resume_url }
                                            ].map((btn, i) => (
                                                <a key={i} href={btn.link || '#'} target="_blank" rel="noopener noreferrer" 
                                                   className={`flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-900/50 flex items-center justify-center transition-all ${btn.bg}`}>
                                                    <btn.icon size={18} className={btn.color} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                                    <div className="space-y-2">
                                        <button 
                                            onClick={() => setShowPasswordPanel(!showPasswordPanel)}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm border border-slate-700/60 hover:border-red-500/60"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 flex items-center justify-center">
                                                    <Shield size={16} />
                                                </span>
                                                Security Settings
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-300/80">Manage</span>
                                        </button>
                                        <button className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm border border-slate-700/60 hover:border-red-500/60">
                                            <span className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 flex items-center justify-center">
                                                    <Globe size={16} />
                                                </span>
                                                Public Profile
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-300/80">Open</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Main Content / Editing */}
                            <div className="md:col-span-2 space-y-8">
                                {isEditing ? (
                                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-md">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            Edit Profile Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Display Name</label>
                                                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-red-500 transition-colors" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Tagline</label>
                                                <input type="text" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-red-500 transition-colors" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Bio / Overview</label>
                                            <textarea rows="4" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-red-500 transition-colors resize-none"></textarea>
                                        </div>
                                        <div className="grid grid-cols-1 gap-8 mb-6">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mt-4 border-t border-slate-700/50 pt-6">Social Links</h4>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">LinkedIn Profile</label>
                                                <div className="relative">
                                                    <input type="text" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} 
                                                    className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500" 
                                                    placeholder=" https://linkedin.com/in/..." />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">GitHub Profile</label>
                                                <div className="relative">
                                                    <input type="text" value={form.github} onChange={e => setForm({...form, github: e.target.value})} 
                                                    className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500" placeholder=" https://github.com/..." />
                                                    </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Resume / Portfolio</label>
                                                <div className="relative">
                                                    <input type="text" value={form.resume_url} onChange={e => setForm({...form, resume_url: e.target.value})} 
                                                    className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500" 
                                                    placeholder=" https://..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Activity Feed */}
                                        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-lg font-bold text-white">Activity Feed</h3>
                                                <button className="text-xs font-bold text-red-400 hover:text-red-300">View All</button>
                                            </div>
                                            <div className="space-y-0">
                                                {archives.length === 0 ? (
                                                    <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-700/50 rounded-xl m-4">
                                                        No mission logs available.
                                                    </div>
                                                ) : (
                                                    archives.map((log) => (
                                                        <div key={log.id} className="flex gap-4 p-4 hover:bg-slate-800/50 rounded-xl transition-colors group cursor-default border-b border-slate-700/50 last:border-0">
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                                                                        MISSION LOG #{log.id}
                                                                    </h4>
                                                                    <span className="text-xs text-slate-500 font-mono">
                                                                        {new Date(log.created_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{log.content}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* Security Panel (Popup in Flow) */}
                                        <AnimatePresence>
                                            {showPasswordPanel && (
                                                <Motion.div 
                                                    initial={{ opacity: 0, height: 0 }} 
                                                    animate={{ opacity: 1, height: 'auto' }} 
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl overflow-hidden backdrop-blur-md"
                                                >
                                                    <div className="flex items-center justify-between mb-6">
                                                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Lock size={18} className="text-red-500"/> Update Credentials</h3>
                                                        <button onClick={() => setShowPasswordPanel(false)} className="text-slate-500 hover:text-white"><X size={18}/></button>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="relative">
                                                            <input type={showCurrent ? "text" : "password"} placeholder="Current Password" value={pwForm.current} onChange={e=>setPwForm({...pwForm, current: e.target.value})} 
                                                            className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500" />
                                                            <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-3.5 text-slate-500 hover:text-white"><Eye size={16}/></button>
                                                        </div>
                                                        <div className="relative">
                                                            <input type={showNew ? "text" : "password"} placeholder="New Password" value={pwForm.newPw} onChange={e=>setPwForm({...pwForm, newPw: e.target.value})} 
                                                            className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500" />
                                                            <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3.5 text-slate-500 hover:text-white"><Eye size={16}/></button>
                                                        </div>
                                                        <div className="relative">
                                                            <input type={showConfirm ? "text" : "password"} placeholder="Confirm Password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm, confirm: e.target.value})} 
                                                            className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500" />
                                                            <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3.5 text-slate-500 hover:text-white"><Eye size={16}/></button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            className={`text-xs font-bold ${
                                                                pwMessage.type === 'error' ? 'text-red-400' : 'text-emerald-400'
                                                            }`}
                                                        >
                                                            {pwMessage.text}
                                                        </div>
                                                        <button
                                                            onClick={handleChangePassword}
                                                            disabled={pwLoading}
                                                            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-900/20 transition-all flex items-center gap-2"
                                                        >
                                                            {pwLoading ? (
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            ) : (
                                                                <CheckCircle2 size={16} />
                                                            )}
                                                            Update Password
                                                        </button>
                                                    </div>
                                                </Motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        {/* Bio Read-Only */}
                                        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                                                Neural Core (Bio)
                                            </h3>
                                            <p className="text-slate-300 leading-relaxed text-sm">
                                                {studentData?.bio ||
                                                    "No biography data detected in the neural link. Click 'Modify Interface' to update your profile metadata."}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
