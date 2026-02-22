import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const Transmissions = () => {
    const [status, setStatus] = useState("IDLE");

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("SENDING");
        setTimeout(() => setStatus("SENT"), 2000);
    };

    return (
        <section className="py-24 min-h-screen">
            <div className="container-premium space-y-24 max-w-4xl">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                        <Mail size={14} />
                        Communications Center
                    </div>
                    <h2 className="text-7xl font-black heading-display">Contact <br /><span className="text-blue-500">The Team</span></h2>
                    <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Have a project in mind or just want to say hello? Our team is always open to discussing new opportunities and technical challenges.
                    </p>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="premium-card p-12 md:p-16 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <MessageSquare size={120} className="text-white" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full bg-slate-950 border border-white/5 p-5 focus:border-blue-500 outline-none transition-all rounded-xl text-white placeholder-slate-700 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your@company.com"
                                    className="w-full bg-slate-950 border border-white/5 p-5 focus:border-blue-500 outline-none transition-all rounded-xl text-white placeholder-slate-700 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Message Details</label>
                            <textarea
                                rows="6"
                                placeholder="Describe your inquiry..."
                                className="w-full bg-slate-950 border border-white/5 p-5 focus:border-blue-500 outline-none transition-all rounded-xl text-white placeholder-slate-700 font-medium resize-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4 group">
                                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${status === 'SENT' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse'}`}></div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
                                    {status === 'IDLE' ? 'System Ready' : status === 'SENDING' ? 'Encapsulating Data' : 'Relay Successful'}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'SENDING' || status === 'SENT'}
                                className={`group min-w-[220px] px-10 py-5 font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl ${status === 'SENT'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
                                    }`}
                            >
                                {status === 'IDLE' && (
                                    <>Transmit Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                                {status === 'SENDING' && (
                                    <>Transmitting <Loader2 size={16} className="animate-spin" /></>
                                )}
                                {status === 'SENT' && (
                                    <>Success <CheckCircle2 size={16} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                <div className="flex flex-col items-center gap-4 pt-12">
                    <div className="flex gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <Mail size={24} className="text-blue-500" />
                        <ShieldCheck size={24} className="text-blue-500" />
                        <MessageSquare size={24} className="text-blue-500" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-600">Enterprise Communication Node 01</span>
                </div>
            </div>
        </section>
    );
};

export default Transmissions;
