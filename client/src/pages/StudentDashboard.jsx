import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { User, Edit3, Save, X, Github, Linkedin, MessageSquare, Shield, Cpu, Activity, Layout, Camera, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const StudentDashboard = ({ user, onUpdate }) => {
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

    // ── Change Password state ──────────────────────────────
    const [showPasswordPanel, setShowPasswordPanel] = useState(false);
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [pwMessage, setPwMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'
    const [pwLoading, setPwLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!user?.studentId) return;
            try {
                const response = await fetch(`http://localhost:5000/api/students/${user.studentId}`);
                const data = await response.json();
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

        fetchStudent();
    }, [user]);

    const handleSave = async () => {
        setMessage('SYNCING...');
        try {
            const res = await fetch(`http://localhost:5000/api/students/${user.studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success || data.id || data.data) {
                const saved = data.data || form;
                setStudentData(prev => ({ ...prev, ...saved }));

                // Build an updates object for every field that changed
                // so the HUD, welcome line & Collective page all update instantly
                if (onUpdate) {
                    const userUpdates = {};
                    if (form.name && form.name !== user.username) userUpdates.username = form.name;
                    if (form.photo && form.photo !== user.photo) userUpdates.photo = form.photo;
                    if (Object.keys(userUpdates).length > 0) onUpdate(userUpdates);
                }

                setMessage('CORE UPDATED');
                setIsEditing(false);
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('ERROR: SYNC FAILED');
            }
        } catch (error) {
            setMessage('ERROR: SERVER OFFLINE');
        }
    };

    const handleChangePassword = async () => {
        setPwMessage({ text: '', type: '' });
        if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
            return setPwMessage({ text: 'Please fill in all fields.', type: 'error' });
        }
        if (pwForm.newPw !== pwForm.confirm) {
            return setPwMessage({ text: 'New passwords do not match.', type: 'error' });
        }
        if (pwForm.newPw.length < 6) {
            return setPwMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
        }
        setPwLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/students/${user.studentId}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
            });
            const data = await res.json();
            if (data.success) {
                setPwMessage({ text: 'Password updated successfully!', type: 'success' });
                setPwForm({ current: '', newPw: '', confirm: '' });
                setTimeout(() => { setShowPasswordPanel(false); setPwMessage({ text: '', type: '' }); }, 2500);
            } else {
                setPwMessage({ text: data.message || 'Failed to update password.', type: 'error' });
            }
        } catch {
            setPwMessage({ text: 'Server offline. Please try again.', type: 'error' });
        } finally {
            setPwLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#030305]">
            <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <section className="section-shell px-6 py-12">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Cpu className="text-red-500 w-5 h-5" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-500">Operative Neural Link</h2>
                        </div>
                        <h1 className="text-5xl font-black heading-display text-white italic">Student Dashboard</h1>
                        <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">Welcome back, {user.username}</p>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4"
                    >
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:bg-white/5 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                                    <X size={16} /> Discard
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-900/40">
                                    <Save size={16} /> Commit Changes
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-red-500/50 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                                <Edit3 size={16} className="text-red-500" /> Modify Interface
                            </button>
                        )}
                    </Motion.div>
                </div>

                {message && (
                    <Motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] text-center rounded-xl"
                    >
                        {message}
                    </Motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Profile Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="panel-card overflow-hidden bg-slate-950/50 border border-white/5"
                        >
                            <div className="aspect-square relative group">
                                <img
                                    src={isEditing ? form.photo : studentData?.photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=1e293b&color=fff&size=512`; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                {isEditing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-center p-6 space-y-4">
                                            <Camera className="mx-auto text-red-500 mb-2" />
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={form.photo}
                                                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none focus:border-red-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-8 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic">{studentData?.name}</h3>
                                    <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{studentData?.tagline || 'System Operative'}</p>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <Activity className="text-slate-500" size={16} />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status: Active Interface</span>
                                </div>
                            </div>
                        </Motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="panel-card p-4 bg-slate-950/50 border border-white/5 text-center">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">ID Code</p>
                                <p className="text-sm font-black text-white">S139_{user.studentId}</p>
                            </div>
                            <div className="panel-card p-4 bg-slate-950/50 border border-white/5 text-center">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Rank</p>
                                <p className="text-sm font-black text-white">Elite</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area / Form */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="panel-card p-10 bg-slate-950/50 border border-white/5 space-y-10">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <Layout className="text-red-500" size={20} />
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Identity Management</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Codename</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className={`w-full p-4 rounded-xl text-sm font-bold bg-slate-900 border transition-all outline-none ${isEditing ? 'border-red-500/50 text-white focus:bg-slate-800' : 'border-white/5 text-slate-500'}`}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mission Tagline</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={form.tagline}
                                        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                                        className={`w-full p-4 rounded-xl text-sm font-bold bg-slate-900 border transition-all outline-none ${isEditing ? 'border-red-500/50 text-white focus:bg-slate-800' : 'border-white/5 text-slate-500'}`}
                                        placeholder="e.g. Architecting the Void"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Neural Core (Bio)</label>
                                <textarea
                                    rows="5"
                                    disabled={!isEditing}
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    className={`w-full p-6 rounded-xl text-sm font-medium leading-relaxed bg-slate-900 border transition-all outline-none resize-none ${isEditing ? 'border-red-500/50 text-white focus:bg-slate-800' : 'border-white/5 text-slate-500'}`}
                                    placeholder="Enter your professional brief..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                        <Linkedin size={12} /> Communication Link (LinkedIn)
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={form.linkedin}
                                        onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                        className={`w-full p-4 rounded-xl text-sm font-bold bg-slate-900 border transition-all outline-none ${isEditing ? 'border-red-500/50 text-white focus:bg-slate-800' : 'border-white/5 text-slate-500'}`}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                        <Github size={12} /> Repository Access (GitHub)
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={form.github}
                                        onChange={(e) => setForm({ ...form, github: e.target.value })}
                                        className={`w-full p-4 rounded-xl text-sm font-bold bg-slate-900 border transition-all outline-none ${isEditing ? 'border-red-500/50 text-white focus:bg-slate-800' : 'border-white/5 text-slate-500'}`}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    Professional Resume (G-Drive/PDF Link)
                                </label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={form.resume_url}
                                    onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
                                    className={`w-full p-4 rounded-xl text-sm font-bold bg-slate-900 border transition-all outline-none ${isEditing ? 'border-red-500/50 text-white focus:bg-slate-800' : 'border-white/5 text-slate-500'}`}
                                    placeholder="https://drive.google.com/your-resume-link"
                                />
                            </div>
                        </div>

                        {/* Recent Activity Mockup */}
                        <div className="panel-card p-8 bg-slate-950/20 border border-white/5">
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">System Logs</h4>
                            <div className="space-y-4">
                                {[
                                    { msg: 'Profile metadata updated', time: '2h ago', icon: Shield },
                                    { msg: 'Project "Cosmic UI" synced', time: '1d ago', icon: Activity },
                                    { msg: 'New message from Archon Astra', time: '3d ago', icon: MessageSquare }
                                ].map((log, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <log.icon className="text-red-500/50" size={14} />
                                            <span className="text-xs text-slate-400">{log.msg}</span>
                                        </div>
                                        <span className="text-[9px] text-slate-600 font-bold uppercase">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Change Password Panel ── */}
                        <div className="panel-card bg-slate-950/50 border border-white/5 overflow-hidden">
                            <button
                                onClick={() => { setShowPasswordPanel(v => !v); setPwMessage({ text: '', type: '' }); }}
                                className="w-full flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                                        <Lock size={15} className="text-red-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-white uppercase tracking-tight">Change Password</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Update your access credentials</p>
                                    </div>
                                </div>
                                <Motion.div animate={{ rotate: showPasswordPanel ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <X size={14} className={`transition-colors ${showPasswordPanel ? 'text-red-500' : 'text-slate-600'}`} />
                                </Motion.div>
                            </button>

                            <AnimatePresence>
                                {showPasswordPanel && (
                                    <Motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-8 space-y-5 border-t border-white/5 pt-6">

                                            {/* Current Password */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        id="pw-current"
                                                        type={showCurrent ? 'text' : 'password'}
                                                        value={pwForm.current}
                                                        onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                                                        placeholder="Enter current password"
                                                        className="w-full p-4 pr-12 rounded-xl text-sm font-bold bg-slate-900 border border-white/10 text-white outline-none focus:border-red-500/60 transition-all placeholder:text-slate-700"
                                                    />
                                                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                                        {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* New Password */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        id="pw-new"
                                                        type={showNew ? 'text' : 'password'}
                                                        value={pwForm.newPw}
                                                        onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })}
                                                        placeholder="Min. 6 characters"
                                                        className="w-full p-4 pr-12 rounded-xl text-sm font-bold bg-slate-900 border border-white/10 text-white outline-none focus:border-red-500/60 transition-all placeholder:text-slate-700"
                                                    />
                                                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                                                <div className="relative">
                                                    <input
                                                        id="pw-confirm"
                                                        type={showConfirm ? 'text' : 'password'}
                                                        value={pwForm.confirm}
                                                        onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                                                        placeholder="Repeat new password"
                                                        className="w-full p-4 pr-12 rounded-xl text-sm font-bold bg-slate-900 border border-white/10 text-white outline-none focus:border-red-500/60 transition-all placeholder:text-slate-700"
                                                    />
                                                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Feedback Message */}
                                            <AnimatePresence>
                                                {pwMessage.text && (
                                                    <Motion.div
                                                        initial={{ opacity: 0, y: -6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -6 }}
                                                        className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-bold ${pwMessage.type === 'success'
                                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                            : 'bg-red-600/10 border-red-500/20 text-red-400'
                                                            }`}
                                                    >
                                                        {pwMessage.type === 'success'
                                                            ? <CheckCircle2 size={14} />
                                                            : <AlertCircle size={14} />}
                                                        {pwMessage.text}
                                                    </Motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Submit Button */}
                                            <button
                                                id="btn-change-password"
                                                onClick={handleChangePassword}
                                                disabled={pwLoading}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 disabled:bg-red-900/40 disabled:text-red-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-900/30"
                                            >
                                                {pwLoading ? (
                                                    <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Updating...</>
                                                ) : (
                                                    <><Lock size={14} /> Commit New Password</>
                                                )}
                                            </button>
                                        </div>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StudentDashboard;
