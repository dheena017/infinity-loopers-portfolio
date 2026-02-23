import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, Mail, Loader2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'Failed to process request.');
            }
        } catch (err) {
            setError('Server connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-shell flex items-center justify-center px-6 relative overflow-hidden min-h-screen py-20">
            <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl panel-card p-24 shadow-2xl relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-8 rounded-2xl bg-red-500/10 mb-10">
                        <Shield className="text-red-500 w-12 h-12" />
                    </div>
                    <h2 className="text-5xl font-black heading-display text-white">Access Recovery</h2>
                    <p className="text-xs text-slate-500 mt-6 uppercase tracking-[0.3em] font-bold">
                        Secure Credential Reset
                    </p>
                </div>

                {success ? (
                    <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <div className="bg-emerald-500/20 p-6 rounded-full text-emerald-500">
                                <CheckCircle size={48} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Reset Link Sent</h3>
                        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                            We've sent a secure recovery link to <span className="text-white font-medium">{email}</span>. 
                            If an account exists, you will receive instructions shortly.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest hover:text-red-400 transition-colors mt-8"
                        >
                            <ArrowRight className="rotate-180" size={16} /> Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-16">
                        <div className="space-y-6">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">
                                Registered Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 p-8 pl-24 text-base focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium placeholder:text-slate-600"
                                    placeholder="Enter your registered email"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 justify-center text-rose-500 text-sm font-medium">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-4 bg-red-500 hover:bg-red-600 text-white font-bold py-8 rounded-2xl transition-all uppercase tracking-widest text-xs"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Verifying Identity...
                                    </>
                                ) : (
                                    'Send Recovery Link'
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full text-center text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Cancel Authentication
                            </button>
                        </div>
                    </form>
                )}
            </Motion.div>
        </section>
    );
};

export default ForgotPassword;
