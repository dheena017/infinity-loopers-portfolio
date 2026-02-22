import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Radio, Mail, MessageSquare, Target, Cpu } from 'lucide-react';

const Transmissions = () => {
    const [status, setStatus] = useState("IDLE");

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("SENDING");
        setTimeout(() => setStatus("SENT"), 2000);
    };

    return (
        <section className="py-64 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-10"></div>

            <div className="container-premium relative z-10 w-full max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center mb-32 text-center"
                >
                    <div className="flex items-center gap-6 mb-8 text-cyan-400">
                        <Radio size={14} className="animate-pulse" />
                        <span className="font-mono-tech !text-[9px]">Comm_Link: Sub-space_Transmissions</span>
                    </div>

                    <h2 className="text-8xl font-black tracking-tighter italic uppercase leading-none text-white font-space">
                        SUB-SPACE<br />
                        <span className="text-cyan-500 glow-text">TRANSMISSIONS</span>
                    </h2>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="glass-panel p-20 relative"
                >
                    <div className="absolute top-10 left-10 flex gap-4 text-white/10 uppercase font-black text-[8px] tracking-[0.5em]">
                        <Target size={10} /> Sector_Secure
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block pl-2">Frequency_ID</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/10 p-5 focus:border-cyan-500 outline-none transition-all italic text-white placeholder-white/20"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block pl-2">Access_Node</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 p-5 focus:border-cyan-500 outline-none transition-all italic text-white placeholder-white/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block pl-2">Message_Packet</label>
                            <textarea
                                rows="6"
                                placeholder="State your objective..."
                                className="w-full bg-white/5 border border-white/10 p-5 focus:border-cyan-500 outline-none transition-all italic text-white placeholder-white/20 resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-white/5">
                            <div className="flex items-center gap-6">
                                <div className={`w-3 h-3 rounded-full ${status === 'SENT' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                                <span className="font-mono-tech !text-[9px] !opacity-100 uppercase tracking-widest text-gray-500">
                                    {status === 'IDLE' ? 'Link_Ready' : status === 'SENDING' ? 'Transmitting_Packet' : 'Relay_Confirmed'}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'SENDING'}
                                className="group px-16 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-cyan-500 transition-all flex items-center gap-6"
                            >
                                {status === 'SENT' ? 'Success' : 'Send_Relay'}
                                <Send size={14} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                            </button>
                        </div>
                    </form>

                    {/* Decorative bottom corner */}
                    <div className="absolute bottom-10 right-10 flex gap-4">
                        <Cpu size={14} className="text-white/5" />
                        <MessageSquare size={14} className="text-white/5" />
                    </div>
                </motion.div>

                <div className="mt-32 flex justify-center gap-24 opacity-20">
                    <Mail size={16} />
                    <Radio size={16} />
                </div>
            </div>
        </section>
    );
};

export default Transmissions;
