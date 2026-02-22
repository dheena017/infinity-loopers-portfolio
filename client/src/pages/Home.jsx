import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Database, Globe2, Layers, Rocket } from 'lucide-react';

const Home = () => {
    return (
        <section className="min-h-screen py-24 flex items-center">
            <div className="container-premium gap-16 grid grid-cols-1 lg:grid-cols-2 items-center">

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-10"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest"
                        >
                            <Rocket size={14} className="animate-bounce" />
                            System Active: Frontier Protocol
                        </motion.div>

                        <h1 className="text-7xl md:text-8xl font-black heading-display leading-[0.85] tracking-tighter">
                            Digital <br />
                            <span className="text-blue-500 text-glow">Frontier</span> <br />
                            Engine
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
                            Explore the vast expanse of technical achievements and professional growth within our high-performance cosmic ecosystem.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4">
                        <button className="btn-primary group">
                            Initialize Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Dashboard Mockup/Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    <div className="premium-card p-10 grid grid-cols-2 gap-6 relative z-10 overflow-hidden shadow-2xl shadow-blue-500/5">
                        <div className="col-span-2 space-y-4">
                            <div className="h-4 w-32 bg-slate-700/50 rounded-full"></div>
                            <div className="h-32 w-full bg-gradient-to-br from-blue-500/20 to-indigo-500/5 rounded-xl border border-white/5 flex items-center justify-center">
                                <BarChart3 size={48} className="text-blue-500/40" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 w-20 bg-slate-700/50 rounded-full"></div>
                            <div className="h-24 w-full bg-slate-800/50 rounded-xl border border-white/5 flex items-center justify-center">
                                <Database size={32} className="text-slate-600" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 w-24 bg-slate-700/50 rounded-full"></div>
                            <div className="h-24 w-full bg-slate-800/50 rounded-xl border border-white/5 flex items-center justify-center">
                                <Layers size={32} className="text-slate-600" />
                            </div>
                        </div>

                        {/* Animated accent circle */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -z-10"></div>
                    </div>

                    {/* Background Decorative Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-800 rounded-full -z-10 pointer-events-none opacity-20 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-slate-800 rounded-full -z-10 pointer-events-none opacity-10"></div>
                </motion.div>

            </div>
        </section>
    );
};

export default Home;
