import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, User, LogIn, AlertCircle, Loader2, ArrowRight, NotebookText, Pencil, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!supabase) {
                throw new Error('Database connection unavailable');
            }

            // Query based on role
            let query;
            if (role === 'student') {
                query = supabase.from('students').select('*').eq('email', username).single();
            } else if (role === 'teacher') {
                query = supabase.from('mentors').select('*').eq('email', username).single();
            } else {
                query = supabase.from('secretaries').select('*').eq('email', username).single();
            }

            const { data: userData, error } = await query;

            if (error || !userData) {
                setError('Invalid credentials');
                return;
            }

            // Simple password check (for demo - use proper auth in production)
            if (userData.password !== password) {
                setError('Invalid credentials');
                return;
            }

            // Successful login
            const user = {
                id: userData.id,
                studentId: userData.id,
                username: userData.name,
                email: userData.email,
                photo: userData.photo,
                role: role
            };

            onLogin(user);

            if (role === 'student') {
                navigate('/student');
            } else if (role === 'teacher') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center p-6 bg-transparent">
            <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-lg bg-[#080a0f]/80 backdrop-blur-2xl p-10 md:p-14 shadow-[0_0_80px_rgba(239,68,68,0.15)] border border-white/10 rounded-[2.5rem]"
            >
                {/* Header Decoration */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
                    <h1 className="text-4xl md:text-5xl font-black text-white heading-display tracking-tighter uppercase text-center mb-2">
                        System <span className="text-red-600 italic">Login</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Integrated Access Protocol</p>
                </div>
                <br></br>
                {/* Role Selectors */}
                <div className="flex justify-center gap-10 mb-12 border-b border-white/5 pb-10">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex flex-col items-center gap-3 transition-all duration-300 ${role === 'student' ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${role === 'student' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}>
                            <div className="relative">
                                <NotebookText size={22} className="absolute -top-1 -left-1" />
                                <Pencil size={20} className="translate-x-1 translate-y-1" />
                            </div>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Folks</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`flex flex-col items-center gap-3 transition-all duration-300 ${role === 'teacher' ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${role === 'teacher' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}>
                            <div className="relative">
                                <User size={22} className="absolute -top-1 -left-1" />
                                <Shield size={20} className="translate-x-1 translate-y-1" />
                            </div>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Mentors</span>
                    </button>
                </div>
                <br></br>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                            {role === 'student' ? 'Enter Registered Email' : 'Enter Mentor Username'}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 p-5 py-7 text-sm focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium placeholder:text-slate-800"
                            placeholder={role === 'student' ? 'email@example.com' : 'username'}
                            required
                        />
                    </div>
                    <br></br>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Enter Protocol Password
                            </label>
                            <Link to="/forgot-password" size={10} className="text-[10px] font-black text-red-600/60 hover:text-red-500 uppercase tracking-widest transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 p-5 py-7 text-sm focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium placeholder:text-slate-800"
                                placeholder="  ••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-500 transition-colors"
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <Motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle size={14} className="text-red-500" />
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{error}</p>
                        </Motion.div>
                    )}
                    <br></br>
                    <div className="flex flex-col items-center gap-6 pt-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex items-center justify-center bg-red-600 text-white w-48 h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_15px_30px_-5px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span>LOGIN</span>
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                        <p className="text-[10px] text-slate-700 uppercase tracking-widest font-black">
                            Security Level: High Integrity
                        </p>
                    </div>
                </form>
            </Motion.div>
        </section>
    );
};

export default Login;
<span>LOGIN</span>
