import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, Mail, Loader2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!supabase) {
                throw new Error('Database connection unavailable');
            }

            // Use Supabase's built-in password reset
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                throw resetError;
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Server connection error. Please try again later.');
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
                        Access <span className="text-red-600 italic">Recovery</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Secure Credential Reset</p>
                </div>
                <br></br>
                {success ? (
                    <div className="text-center space-y-8 py-10">
                        <div className="flex justify-center">
                            <div className="bg-emerald-500/10 p-6 rounded-full text-emerald-500 border border-emerald-500/20">
                                <CheckCircle size={48} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Identity verified</h3>
                        <p className="text-[12px] text-slate-400 max-w-md mx-auto leading-relaxed uppercase tracking-wider font-medium">
                            Recovery link transmitted to <span className="text-white font-bold">{email}</span>.
                            Check your terminal.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-[0.2em] hover:text-red-400 transition-colors mt-8"
                        >
                            <ArrowRight className="rotate-180" size={16} /> Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="flex flex-col items-center space-y-4 px-6">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                Registered Email Address
                            </label>
                            <div className="relative w-full max-w-[420px]">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border border-white/20 p-5 py-12 text-sm focus:border-red-500 rounded-3xl outline-none transition-all text-white font-medium placeholder:text-slate-800 text-center"
                                    placeholder="email@example.com"
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
                        <br></br>
                        <div className="flex flex-col items-center gap-6 pt-10">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white w-40 h-10 rounded-lg font-black uppercase tracking-[0.2em] text-[9px] shadow-[0_10px_20px_-5px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                                {loading ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        TRANSMIT <ArrowRight size={12} />
                                    </span>
                                )}
                            </button>
                          
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="px-5 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-[9px] font-black text-red-500/80 hover:text-red-500 uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                            >
                                Cancel Authentication
                            </button>
                            
                        </div>
                        <br></br>
                    </form>
                )}
            </Motion.div>
        </section>
    );
};

export default ForgotPassword;

