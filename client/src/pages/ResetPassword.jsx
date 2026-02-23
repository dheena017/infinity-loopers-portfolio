import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, KeyRound, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
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
            // In a real app, you would send the token and new password to your backend
            // const response = await fetch('http://localhost:5000/api/reset-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ token, newPassword }),
            // });
            
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError('Failed to reset password. Link may be expired.');
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
                    <h2 className="text-5xl font-black heading-display text-white">Reset Credentials</h2>
                    <p className="text-xs text-slate-500 mt-6 uppercase tracking-[0.3em] font-bold">
                        Secure Access Recovery
                    </p>
                </div>

                {success ? (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400">
                                <CheckCircle2 size={48} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Password Updated</h3>
                        <p className="text-slate-400">Your secure access credentials have been reset successfully.</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest animate-pulse">Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-16">
                        
                        {/* New Password */}
                        <div className="space-y-6">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 p-8 text-base focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium placeholder:text-slate-600"
                                    placeholder="Enter new secure password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-6">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 p-8 text-base focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium placeholder:text-slate-600"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 justify-center text-rose-500 text-sm font-medium">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-4 bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-2xl transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Updating Credentials...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}
            </Motion.div>
        </section>
    );
};

export default ResetPassword;
