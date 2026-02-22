import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, Globe, Shield, Activity, Target } from 'lucide-react';

const Home = () => {
    return (
        <section className="min-h-screen flex items-center pt-32 pb-64 relative overflow-hidden">
            <div className="container-premium relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">

                    {/* Visual & Metadata Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 flex flex-col gap-12"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Activity size={12} className="text-cyan-400 animate-pulse" />
                                <span className="font-mono-tech">System_Protocol_Alpha</span>
                            </div>
                            <div className="h-[2px] w-24 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                        </div>

                        <div className="glass-panel p-8 space-y-8 rounded-sm">
                            <div className="flex justify-between items-center text-[10px] opacity-40 uppercase tracking-widest font-bold">
                                <span>Telemetry_Stream</span>
                                <span className="text-cyan-400">Stable</span>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: "Core_Clock", val: "4.8GHz", progress: 85 },
                                    { label: "Neural_Link", val: "Active", progress: 100 },
                                    { label: "Data_Flow", val: "1.2GB/s", progress: 64 }
                                ].map((stat) => (
                                    <div key={stat.label} className="space-y-2">
                                        <div className="flex justify-between text-[9px] font-bold uppercase mapping tracking-wide">
                                            <span className="opacity-60">{stat.label}</span>
                                            <span className="font-mono">{stat.val}</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.progress}%` }}
                                                transition={{ duration: 2, delay: 0.5 }}
                                                className="h-full bg-cyan-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="glass-card p-6 flex flex-col gap-3">
                                <Target size={16} className="text-cyan-500/50" />
                                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Objective</span>
                                <span className="text-xs font-bold italic">INNOVATE</span>
                            </div>
                            <div className="glass-card p-6 flex flex-col gap-3">
                                <Globe size={16} className="text-cyan-500/50" />
                                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Network</span>
                                <span className="text-xs font-bold italic">SQUAD_139</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Editorial Content Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="lg:col-span-7 flex flex-col justify-center gap-12"
                    >
                        <div className="space-y-6">
                            <motion.h1
                                className="text-8xl md:text-[10rem] font-black leading-[0.85] italic font-space text-white uppercase"
                            >
                                MISSION<br />
                                <span className="text-cyan-500 glow-text">CONTROL</span>
                            </motion.h1>
                            <p className="text-xl md:text-2xl font-light text-gray-400 max-w-xl leading-relaxed italic">
                                Orchestrating high-fidelity digital experiences at the intersection of complex logic and cinematic motion.
                            </p>
                        </div>

                        <div className="flex items-center gap-12">
                            <button className="group relative flex items-center gap-6 px-12 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] overflow-hidden transition-all hover:pr-16">
                                <span className="relative z-10 transition-transform group-hover:translate-x-[-4px]">Explore_Work</span>
                                <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-[1px] bg-white/10"></div>
                                <span className="text-[10px] font-bold opacity-20 uppercase tracking-[0.5em]">Scroll_to_Initiate</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Subtle Gradient background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none"></div>
        </section>
    );
};

export default Home;

