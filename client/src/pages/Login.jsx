import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, UserCheck, Eye, LogIn, AlertCircle } from 'lucide-react';
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
        <section className="min-h-screen flex items-center justify-center pt-32 pb-24 relative overflow-hidden px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-panel p-10 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyan-500/10 mb-6">
                        <Shield className="text-cyan-400 w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white font-space">System Access</h2>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.3em] font-bold">Secure_Identity_Protocol</p>
                </div>

                <div className="flex gap-2 mb-10">
                    {[
                        { id: 'teacher', label: 'Teacher', icon: Shield },
                        { id: 'student', label: 'Student', icon: UserCheck },
                        { id: 'visitor', label: 'Visitor', icon: Eye }
                    ].map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 border transition-all duration-500 ${role === r.id
                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                }`}
                        >
                            <r.icon size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{r.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {role !== 'visitor' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Identity_Handle</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm focus:border-cyan-500/50 outline-none transition-all"
                                        placeholder="Username"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Security_Key</label>
                                <div className="relative">
                                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm focus:border-cyan-500/50 outline-none transition-all"
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
                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs"
                        >
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full group relative flex items-center justify-center gap-4 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] overflow-hidden transition-all hover:bg-cyan-400"
                    >
                        <span className="relative z-10">{loading ? 'Processing...' : 'Initialize_Session'}</span>
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-white/5 text-center">
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">
                        Unauthorized access is strictly monitored by <span className="text-white/40">SQUAD_139_SECURITY</span>
                    </p>
                </div>
            </motion.div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        </section>
    );
};

export default Login;
