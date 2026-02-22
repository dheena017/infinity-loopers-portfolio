import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, UserCheck, Eye, LogIn, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();

            if (data.success) {
                onLogin(data.user);
                navigate('/');
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center py-24 px-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md premium-card p-12 bg-slate-900 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-500/10 mb-6">
                        <Shield className="text-blue-500 w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black heading-display text-white">Platform Access</h2>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.3em] font-bold">Secure Identity Authentication</p>
                </div>

                <div className="flex gap-2 mb-10">
                    {[
                        { id: 'teacher', label: 'Admin', icon: Shield },
                        { id: 'student', label: 'Member', icon: UserCheck },
                        { id: 'visitor', label: 'Guest', icon: Eye }
                    ].map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${role === r.id
                                ? 'bg-blue-600/10 border-blue-600/50 text-blue-400 shadow-lg shadow-blue-900/10'
                                : 'bg-slate-950 border-white/5 text-slate-600 hover:border-white/10'
                                }`}
                        >
                            <r.icon size={16} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{r.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {role !== 'visitor' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Identity Handle</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 p-4 pl-12 text-sm focus:border-blue-500 rounded-xl outline-none transition-all text-white font-medium"
                                        placeholder="Username"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
                                <div className="relative">
                                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 p-4 pl-12 text-sm focus:border-blue-500 rounded-xl outline-none transition-all text-white font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold"
                        >
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full group relative flex items-center justify-center gap-4 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl overflow-hidden transition-all hover:bg-blue-500 shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>Authorize Session <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-white/5 text-center">
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black leading-loose">
                        System access is logged and encrypted. <br /> Secure Environment v3.1.0
                    </p>
                </div>
            </motion.div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none"></div>
        </section>
    );
};

export default Login;
