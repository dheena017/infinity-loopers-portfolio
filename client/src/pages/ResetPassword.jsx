import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            if (!supabase) {
                throw new Error('Database connection unavailable');
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                throw updateError;
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setError(error.message || 'Failed to reset password. Link may be expired.');
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
                className="w-full max-w-2xl bg-[#080a0f]/80 backdrop-blur-2xl p-10 md:p-14 shadow-[0_0_80px_rgba(239,68,68,0.15)] border border-white/10 rounded-[2.5rem]"
            >
                {/* Header Decoration */}
                <div className="flex flex-col items-center mb-16">
                    <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
                    <h2 className="text-4xl md:text-5xl font-black text-white heading-display tracking-tighter uppercase text-center mb-2">
                        Reset <span className="text-red-600 italic">Credentials</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Secure Access Recovery</p>
                </div>

                {success ? (
                    <div className="text-center space-y-8 py-10">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 size={48} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Access Restored</h3>
                        <p className="text-[12px] text-slate-400 max-w-md mx-auto leading-relaxed uppercase tracking-wider font-medium">Your credentials have been updated. Redirecting to terminal...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="flex flex-col items-center space-y-4 px-6">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                New Secure Protocol Password
                            </label>
                            <div className="relative w-full max-w-[420px]">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-transparent border border-white/20 p-5 py-12 text-sm focus:border-red-500 rounded-3xl outline-none transition-all text-white font-medium placeholder:text-slate-800 text-center"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center space-y-4 px-6">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                Confirm New Protocol Password
                            </label>
                            <div className="relative w-full max-w-[420px]">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-transparent border border-white/20 p-5 py-12 text-sm focus:border-red-500 rounded-3xl outline-none transition-all text-white font-medium placeholder:text-slate-800 text-center"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 justify-center text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col items-center pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white w-48 h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_15px_30px_-5px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    'Update Credentials'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </Motion.div>
        </section>
    );
};

export default ResetPassword;
