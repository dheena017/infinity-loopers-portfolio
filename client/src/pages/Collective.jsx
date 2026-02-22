import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Github, Linkedin, ExternalLink, Activity, LayoutGrid, Cpu, UserCheck, Edit3, Save, XCircle, ShieldCheck, Filter } from 'lucide-react';

// ─── Edit Modal (Admin/Teacher only) ───────────────────────────────────────────────
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
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative w-full max-w-lg premium-card p-10 space-y-8 bg-slate-900 shadow-2xl"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 text-blue-500 mb-2 font-bold uppercase tracking-widest text-[10px]">
                            <ShieldCheck size={14} />
                            Administrative Access
                        </div>
                        <h3 className="text-3xl font-black heading-display">Update Profile</h3>
                        <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">Member ID: {student.id}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full bg-slate-800/50 border border-white/5 rounded-lg p-4 text-sm focus:border-blue-500 outline-none transition-all"
                            placeholder="Full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">LinkedIn URL</label>
                        <div className="relative">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                            <input
                                value={form.linkedin}
                                onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-lg p-4 pl-12 text-sm focus:border-blue-500 outline-none transition-all"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">GitHub URL</label>
                        <div className="relative">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                            <input
                                value={form.github}
                                onChange={(e) => setForm(f => ({ ...f, github: e.target.value }))}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-lg p-4 pl-12 text-sm focus:border-blue-500 outline-none transition-all"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-3 py-4 border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <XCircle size={16} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                    >
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {saveMsg && (
                    <p className={`text-xs text-center font-bold ${saveMsg.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {saveMsg}
                    </p>
                )}
            </motion.div>
        </div>
    );
};

// ─── Profile Modal (View) ────────────────────────────────────────────────────
const ProfileModal = ({ student, onClose, user, onEdit }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
        />
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="relative w-full max-w-5xl h-[600px] premium-card overflow-hidden flex flex-col md:flex-row shadow-2xl bg-slate-900"
        >
            {/* Image */}
            <div className="w-full md:w-2/5 relative bg-slate-950">
                <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=1e293b&color=fff&size=512`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-8 left-8 space-y-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase">Member Verified</span>
                </div>
            </div>

            {/* Info */}
            <div className="w-full md:w-3/5 p-12 flex flex-col justify-between">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-blue-500 text-xs font-bold uppercase tracking-widest">
                            <Cpu size={14} />
                            Identification Code: 2024_{student.id}
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black heading-display break-words">{student.name}</h2>
                    </div>

                    <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
                        A dedicated member of the portfolio team, focusing on high-impact solutions and modular architecture design.
                    </p>

                    <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Role</span>
                            <div className="text-sm font-bold text-white uppercase italic">Full Stack Engineer</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Term</span>
                            <div className="text-sm font-bold text-blue-400 uppercase italic">{student.term || 'General'}</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-8 flex-wrap">
                    {student.github && (
                        <a href={student.github} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-800 border border-white/5 hover:border-blue-500/50 rounded-xl transition-all group">
                            <Github size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </a>
                    )}
                    {student.linkedin && (
                        <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-800 border border-white/5 hover:border-blue-500/50 rounded-xl transition-all group">
                            <Linkedin size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </a>
                    )}

                    {user?.role === 'teacher' && (
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600/10 border border-blue-500/30 text-blue-400 font-bold uppercase tracking-widest text-xs hover:bg-blue-600/20 rounded-xl transition-colors"
                        >
                            <Edit3 size={16} /> Edit Profile
                        </button>
                    )}

                    <button className="flex-1 min-w-[140px] px-8 py-4 bg-white text-slate-950 font-bold uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-3">
                        View Resume <ExternalLink size={16} />
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
    const [selectedTerm, setSelectedTerm] = useState('All Terms');

    const handleSave = (updated) => {
        setStudents(prev => prev.map(s => s.id === updated.id ? { ...s, ...updated } : s));
        setSelectedStudent({ ...selectedStudent, ...updated });
        setEditingStudent(null);
    };

    const terms = ['All Terms', ...new Set(students.map(s => s.term).filter(Boolean))];
    const filteredStudents = selectedTerm === 'All Terms'
        ? students
        : students.filter(s => s.term === selectedTerm);

    return (
        <section className="py-24 min-h-screen">
            <div className="container-premium space-y-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-12"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            <LayoutGrid size={14} />
                            Directory System v3
                        </div>
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black heading-display break-words">Meet the <br /><span className="text-blue-500">Professional</span> Team</h2>
                    </div>

                    {/* Filter Section */}
                    <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                            <Filter size={12} /> Filter Results
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {terms.map(term => (
                                <button
                                    key={term}
                                    onClick={() => setSelectedTerm(term)}
                                    className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all border ${selectedTerm === term
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40'
                                        : 'border-white/5 text-slate-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {filteredStudents.map((student, idx) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => setSelectedStudent(student)}
                            className="group relative cursor-pointer premium-card overflow-hidden aspect-[4/5]"
                        >
                            <img
                                src={student.photo}
                                alt={student.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=1e293b&color=fff&size=512`; }}
                            />
                            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent">
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block opacity-0 group-hover:opacity-100 transition-opacity">ID_{student.id}</span>
                                <div className="text-sm font-bold text-white heading-display truncate">{student.name}</div>
                            </div>

                            {user?.role === 'teacher' && (
                                <div className="absolute top-4 right-4 p-2 bg-blue-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit3 size={14} className="text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedStudent && !editingStudent && (
                    <ProfileModal
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
