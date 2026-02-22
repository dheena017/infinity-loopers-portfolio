import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Github, Linkedin, ExternalLink, Activity, Radio, Cpu, Target, Edit3, Save, XCircle, Shield } from 'lucide-react';

// ─── Edit Modal (Teacher only) ───────────────────────────────────────────────
const EditModal = ({ student, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: student.name || '',
        linkedin: student.linkedin || '',
        github: student.github || '',
    });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            const res = await fetch(`http://localhost:5000/api/students/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                onSave({ ...student, ...form });
                setSaveMsg('✓ Saved successfully');
                setTimeout(onClose, 800);
            } else {
                setSaveMsg('✗ Save failed');
            }
        } catch {
            setSaveMsg('✗ Server error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="relative w-full max-w-lg glass-panel p-10 space-y-8"
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 text-cyan-400 mb-2">
                            <Shield size={12} />
                            <span className="font-mono-tech !text-[9px] uppercase tracking-widest">Teacher_Edit_Mode</span>
                        </div>
                        <h3 className="text-2xl font-black italic uppercase text-white font-space">Edit_Dossier</h3>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">SQ_{student.id} — {student.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Operative_Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-cyan-500/50 outline-none transition-all"
                            placeholder="Student name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">LinkedIn_URL</label>
                        <div className="relative">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                            <input
                                value={form.linkedin}
                                onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm focus:border-cyan-500/50 outline-none transition-all"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">GitHub_URL</label>
                        <div className="relative">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                            <input
                                value={form.github}
                                onChange={(e) => setForm(f => ({ ...f, github: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm focus:border-cyan-500/50 outline-none transition-all"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-3 py-4 border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <XCircle size={14} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-all"
                    >
                        <Save size={14} /> {saving ? 'Saving...' : 'Save_Changes'}
                    </button>
                </div>

                {saveMsg && (
                    <p className={`text-xs text-center font-bold ${saveMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                        {saveMsg}
                    </p>
                )}
            </motion.div>
        </div>
    );
};

// ─── Dossier Modal (View) ────────────────────────────────────────────────────
const DossierModal = ({ student, onClose, user, onEdit }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
        />
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="relative w-full max-w-5xl h-[700px] glass-panel rounded-sm overflow-hidden flex flex-col md:flex-row"
        >
            {/* Image */}
            <div className="w-full md:w-2/5 relative bg-black">
                <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover grayscale opacity-60"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=0891b2&color=fff&size=512`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] to-transparent" />
                <div className="absolute bottom-12 left-12 space-y-2">
                    <span className="font-mono-tech !text-[8px] !text-cyan-400 uppercase">Status: Certified</span>
                    <div className="text-2xl font-black italic text-white uppercase font-space">SQUAD_MEMBER</div>
                </div>
            </div>

            {/* Info */}
            <div className="w-full md:w-3/5 p-16 flex flex-col justify-between">
                <button onClick={onClose} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="space-y-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-cyan-500">
                            <Cpu size={14} />
                            <span className="font-mono-tech !text-[10px]">Dossier_Link: {student.id}_ALPHA</span>
                        </div>
                        <h2 className="text-7xl font-black tracking-tighter text-white uppercase italic font-space">{student.name}</h2>
                    </div>

                    <p className="text-lg text-gray-400 leading-relaxed font-light italic max-w-lg">
                        Active contributor to the Squad 139 repository, specializing in modern engineering logic and cosmic systems design.
                    </p>

                    <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
                        <div className="space-y-2">
                            <span className="text-[8px] text-gray-600 uppercase tracking-widest font-black">Designation</span>
                            <div className="text-xs font-bold text-gray-300">CORE_ENGINEER</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[8px] text-gray-600 uppercase tracking-widest font-black">Origin</span>
                            <div className="text-xs font-bold text-gray-300">SECTOR_139</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-12 flex-wrap">
                    {student.github && (
                        <a href={student.github} target="_blank" rel="noopener noreferrer" className="p-4 glass-card border-white/10 hover:border-cyan-500/50 transition-all">
                            <Github size={18} className="text-gray-500 hover:text-cyan-400" />
                        </a>
                    )}
                    {student.linkedin && (
                        <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 glass-card border-white/10 hover:border-cyan-500/50 transition-all">
                            <Linkedin size={18} className="text-gray-500 hover:text-cyan-400" />
                        </a>
                    )}

                    {user?.role === 'teacher' && (
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-3 px-8 py-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-cyan-500/20 transition-colors"
                        >
                            <Edit3 size={14} /> Edit_Dossier
                        </button>
                    )}

                    <button className="flex-1 min-w-[140px] px-8 py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-cyan-500 transition-colors flex items-center justify-center gap-4">
                        Open_Manifest <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
);

// ─── Main Collective Page ────────────────────────────────────────────────────
const Collective = ({ students, user, setStudents }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleSave = (updated) => {
        setStudents(prev => prev.map(s => s.id === updated.id ? { ...s, ...updated } : s));
        setSelectedStudent({ ...selectedStudent, ...updated });
        setEditingStudent(null);
    };

    return (
        <section className="py-64 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-10" />

            <div className="container-premium relative z-10 w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col mb-48 border-l-2 border-cyan-500/30 pl-12"
                >
                    <div className="flex items-center gap-6 mb-8 text-cyan-400">
                        <Radio size={12} className="animate-pulse" />
                        <span className="font-mono-tech !text-[9px]">Personnel_Database_v2.0</span>
                    </div>

                    <h2 className="text-9xl font-black tracking-tighter italic uppercase leading-none text-white font-space">
                        THE<br />
                        <span className="text-cyan-500 glow-text">CREW</span>
                    </h2>

                    <div className="flex gap-16 mt-16 opacity-40">
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-[0.2em] font-bold mb-1">Cadets</span>
                            <span className="text-lg font-black italic">{students.length}_ACTIVE</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20" />
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-[0.2em] font-bold mb-1">Access</span>
                            <span className={`text-lg font-black italic ${user ? 'text-cyan-400' : 'text-gray-500'}`}>
                                {user ? user.role.toUpperCase() : 'VISITOR'}
                            </span>
                        </div>
                        {user?.role === 'teacher' && (
                            <>
                                <div className="w-[1px] h-10 bg-white/20" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase tracking-[0.2em] font-bold mb-1">Mode</span>
                                    <span className="text-lg font-black italic text-green-400">EDIT_ENABLED</span>
                                </div>
                            </>
                        )}
                    </div>

                    {user?.role === 'teacher' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest w-fit"
                        >
                            <Shield size={12} />
                            Teacher Mode — Click any student card to view & edit their details
                        </motion.div>
                    )}
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {students.map((student, idx) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: (idx % 12) * 0.05 }}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedStudent(student)}
                            className="group relative cursor-pointer aspect-[3/4] bg-white/[0.02] border border-white/5 hover:border-cyan-500/50 transition-all duration-700 overflow-hidden"
                        >
                            <div className="relative w-full h-full">
                                <img
                                    src={student.photo}
                                    alt={student.name}
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=0891b2&color=fff&size=512`; }}
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/40 to-transparent">
                                    <div className="font-mono-tech !text-[7px] !text-cyan-400 mb-1">SQ_{student.id}</div>
                                    <div className="text-[10px] font-bold text-white uppercase tracking-widest truncate">{student.name}</div>
                                </div>
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <Target size={12} className="text-cyan-400" />
                                    {user?.role === 'teacher' && <Edit3 size={12} className="text-yellow-400" />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Dossier Modal */}
            <AnimatePresence>
                {selectedStudent && !editingStudent && (
                    <DossierModal
                        student={selectedStudent}
                        user={user}
                        onClose={() => setSelectedStudent(null)}
                        onEdit={() => setEditingStudent(selectedStudent)}
                    />
                )}
            </AnimatePresence>

            {/* Edit Modal */}
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

export default Collective;
