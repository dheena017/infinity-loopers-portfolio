import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Users, BookOpen, Rocket, Search, Edit3, Trash2, Plus, ArrowUpRight, CheckCircle, Activity, Globe, X, Save, Linkedin, Github } from 'lucide-react';

const EditModal = ({ student, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: student.name || '',
        email: student.email || '',
        linkedin: student.linkedin || '',
        github: student.github || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/students/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success || data.id) {
                onSave({ ...student, ...form });
                onClose();
            }
        } catch (error) {
            console.error('Error saving student:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
            <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg panel-card p-10 bg-slate-900 border border-white/10 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-white uppercase italic">Modify Entry</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Codename</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-red-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link (Email)</label>
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-red-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LinkedIn</label>
                            <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-xs text-white focus:border-red-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GitHub</label>
                            <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-xs text-white focus:border-red-500 outline-none" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-10">
                    <button onClick={onClose} className="flex-1 py-4 border border-white/5 text-slate-500 font-bold uppercase text-[10px] tracking-widest rounded-xl">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-4 bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-red-900/40">
                        {saving ? 'Syncing...' : 'Commit Changes'}
                    </button>
                </div>
            </Motion.div>
        </div>
    );
};

const TeacherDashboard = ({ students, setStudents }) => {
    const [editingStudent, setEditingStudent] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: students.length,
        activeMissions: 3,
        systemHealth: '99.8%',
        lastSync: '2m ago'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('All');

    const handleSave = (updated) => {
        setStudents(prev => prev.map(s => s.id === updated.id ? { ...s, ...updated } : s));
        setEditingStudent(null);
    };

    const filteredStudents = students.filter(s =>
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filterTerm === 'All' || s.term === filterTerm)
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <section className="section-shell px-6 py-12">
            <Motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-12"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert className="text-red-500 w-6 h-6" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-500">Archon Level Command</h2>
                        </div>
                        <h1 className="text-6xl font-black heading-display text-white italic">Teacher Console</h1>
                        <p className="text-xs text-slate-500 mt-2 uppercase tracking-[0.2em] font-bold">Managing cosmic squads & mission architecture</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-900/20">
                            <Plus size={16} /> Deploy New Squad
                        </button>
                    </div>
                </div>

                {/* Command Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Registered Operatives', value: students.length, icon: Users, color: 'text-blue-400' },
                        { label: 'Expeditions Live', value: '12', icon: Rocket, color: 'text-amber-400' },
                        { label: 'Architecture Health', value: 'Stable', icon: Activity, color: 'text-emerald-400' },
                        { label: 'Global Node Sync', value: 'Online', icon: Globe, color: 'text-purple-400' }
                    ].map((stat, i) => (
                        <Motion.div
                            key={i}
                            variants={itemVariants}
                            className="panel-card p-8 bg-slate-950/50 border border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-all"
                        >
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{stat.label}</p>
                                    <p className="text-4xl font-black text-white italic">{stat.value}</p>
                                </div>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/5 transition-colors"></div>
                        </Motion.div>
                    ))}
                </div>

                {/* Operative Management Portal */}
                <Motion.div variants={itemVariants} className="panel-card bg-slate-950/30 border border-white/5 overflow-hidden">
                    <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Operative Registry</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">S139 Squad Monitoring System</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-3/5">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search codenames or neural links..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 transition-all"
                                />
                            </div>
                            <select
                                value={filterTerm}
                                onChange={(e) => setFilterTerm(e.target.value)}
                                className="bg-slate-900/50 border border-white/5 rounded-xl px-6 py-4 text-xs font-bold text-slate-400 focus:outline-none focus:border-red-500"
                            >
                                <option>All Terms</option>
                                <option>Term 1</option>
                                <option>Term 2</option>
                                <option>Term 3</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                                <tr>
                                    <th className="px-10 py-6">Operative Codex</th>
                                    <th className="px-10 py-6">Neural Link (Email)</th>
                                    <th className="px-10 py-6">Mission Term</th>
                                    <th className="px-10 py-6">Sync Status</th>
                                    <th className="px-10 py-6 text-right">Command</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredStudents.map((s) => (
                                    <tr key={s.id} className="hover:bg-red-500/[0.02] transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-red-500/50 transition-all">
                                                    <img
                                                        src={s.photo}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${s.name}&background=1e293b&color=fff&size=512`; }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase italic">{s.name}</p>
                                                    <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">ID_S139_{s.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-xs text-slate-400 font-medium">{s.email || 'NO_LINK'}</td>
                                        <td className="px-10 py-6">
                                            <span className="px-3 py-1 bg-white/5 border border-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full">{s.term || 'TERM_0'}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest italic">Encrypted</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingStudent(s)}
                                                    className="p-3 bg-slate-900 border border-white/5 hover:border-red-500/50 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button className="p-3 bg-slate-900 border border-white/5 hover:border-rose-500/50 text-slate-500 hover:text-rose-500 rounded-xl transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Motion.div>
            </Motion.div>

            <AnimatePresence>
                {editingStudent && (
                    <EditModal
                        student={editingStudent}
                        onClose={() => setEditingStudent(null)}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default TeacherDashboard;
