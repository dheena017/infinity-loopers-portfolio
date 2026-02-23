import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Briefcase, Users, FileText, Settings, LogOut, Search, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecretaryDashboard = () => {
    const [secretaries, setSecretaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSecretaries = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/secretaries');
                const data = await response.json();
                setSecretaries(data);
            } catch (error) {
                console.error('Error fetching secretaries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSecretaries();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Briefcase className="text-red-500 w-6 h-6" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-500">Secretary Command</h2>
                        </div>
                        <h1 className="text-5xl font-black heading-display text-white italic">Administrative Portal</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                            <Plus size={16} /> New Entry
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Staff', value: secretaries.length, icon: Users, color: 'text-blue-400' },
                        { label: 'Pending Docs', value: '12', icon: FileText, color: 'text-amber-400' },
                        { label: 'System Health', value: '98%', icon: Settings, color: 'text-emerald-400' }
                    ].map((stat, i) => (
                        <Motion.div
                            key={i}
                            variants={itemVariants}
                            className="panel-card p-6 flex items-center justify-between border border-white/5 bg-slate-950/50"
                        >
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </Motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <Motion.div variants={itemVariants} className="panel-card border border-white/5 bg-slate-950/50 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Personnel Directory</h3>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search registry..."
                                    className="w-full bg-slate-900 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-500/50"
                                />
                            </div>
                            <button className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                                <Filter size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Office</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                                            Initializing secure data link...
                                        </td>
                                    </tr>
                                ) : secretaries.length > 0 ? (
                                    secretaries.map((s) => (
                                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white uppercase">{s.name}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono tracking-tighter">{s.employee_id || 'N/A'}</td>
                                            <td className="px-6 py-4 text-slate-400">{s.office_location || 'REMOTE'}</td>
                                            <td className="px-6 py-4 text-slate-400">{s.email || 'N/A'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-red-500 hover:text-red-400 font-bold uppercase tracking-tighter text-[10px]">Manage</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                                            No secretary records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Motion.div>
            </Motion.div>
        </section>
    );
};

export default SecretaryDashboard;
