import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, User, UserCheck, LogIn, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
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
                if (data.user.role === 'student') {
                    navigate('/student');
                } else if (data.user.role === 'teacher') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch {
            setError('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-shell flex items-center justify-center px-6 relative overflow-hidden">
            <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl panel-card p-10 md:p-16 shadow-2xl relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-red-500/10 mb-8">
                        <Shield className="text-red-500 w-12 h-12" />
                    </div>
                    <h2 className="text-5xl font-black heading-display text-white">Platform Access</h2>
                    <p className="text-xs text-slate-500 mt-3 uppercase tracking-[0.3em] font-bold">Secure Identity Authentication</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Email / Username */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                            {role === 'student' ? 'Email' : 'Username'}
                        </label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 p-5 pl-14 text-base focus:border-red-500 rounded-xl outline-none transition-all text-white font-medium placeholder:text-slate-700"
                                placeholder={role === 'student' ? 'your.email@kalvium.community' : 'admin'}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                        <div className="relative">
                            <LogIn className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 p-5 pl-14 text-base focus:border-red-500 rounded-xl outline-none transition-all text-white font-medium placeholder:text-slate-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <Motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm font-bold"
                        >
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </Motion.div>
                    )}

                    {/* Role selector — Student & Teacher only */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Login As</label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'student', label: 'Student', icon: UserCheck },
                                { id: 'teacher', label: 'Teacher', icon: Shield },
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => { setRole(r.id); setError(''); }}
                                    className={`flex items-center justify-center gap-3 p-5 rounded-xl border font-black text-sm uppercase tracking-widest transition-all duration-300 ${role === r.id
                                            ? 'bg-red-600/15 border-red-500/60 text-red-400 shadow-lg shadow-red-900/20'
                                            : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/15 hover:text-slate-300'
                                        }`}
                                >
                                    <r.icon size={20} />
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full group relative flex items-center justify-center gap-4 py-6 bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-xl overflow-hidden transition-all hover:bg-red-500 shadow-xl shadow-red-900/40 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={22} className="animate-spin" />
                        ) : (
                            <>Authorize Session <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-10 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black leading-loose">
                        System access is logged and encrypted. <br /> Secure Environment v3.1.0
                    </p>
                </div>
            </Motion.div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-400/10 rounded-full blur-[160px] pointer-events-none"></div>
        </section>
    );
};

export default Login;
