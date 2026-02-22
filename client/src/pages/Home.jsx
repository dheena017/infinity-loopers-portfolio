import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Users, Globe2, Briefcase, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Home = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center py-20 overflow-hidden">
            <div className="container-premium space-y-24">

                {/* ─── Hero Section ─── */}
                <div className="max-w-5xl space-y-10 relative z-10 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-[1px] bg-red-500/50"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">Next-Gen Architecture</span>
                        </div>
                        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black heading-display leading-[0.8] tracking-tighter shrink-0">
                            THE <span className="text-red-500 text-glow">FUTURE</span> <br />
                            OF PORTFOLIO.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl"
                    >
                        Expedition through a high-performance ecosystem where design meets engineering in the cold expanse of code.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center gap-8 pt-6"
                    >
                        <NavLink to="/operatives" className="btn-primary flex items-center gap-4 group px-10 py-5">
                            Initialize Sequence <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </NavLink>

                        <div className="hidden sm:flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                                <Zap size={18} className="text-slate-500 group-hover:text-blue-400" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">v3.0 Core Active</span>
                        </div>
                    </motion.div>
                </div>

                {/* ─── Main Pillars (Horizontal Cards) ─── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {[
                        {
                            title: 'Collective',
                            desc: 'Internal personnel directory and operative profiles.',
                            path: '/team',
                            icon: Users,
                            color: 'from-blue-600/10'
                        },
                        {
                            title: 'Expeditions',
                            desc: 'Comprehensive archive of global technical breakthroughs.',
                            path: '/expeditions',
                            icon: Globe2,
                            color: 'from-indigo-600/10'
                        },
                        {
                            title: 'Operatives',
                            desc: 'Strategic leadership and core project architects.',
                            path: '/operatives',
                            icon: Briefcase,
                            color: 'from-slate-600/10'
                        }
                    ].map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + (i * 0.1), duration: 0.8 }}
                        >
                            <NavLink
                                to={card.path}
                                className={`group block premium-card p-10 space-y-8 bg-gradient-to-br ${card.color} to-transparent border-white/5 hover:border-blue-500/30 transition-all active:scale-[0.98] h-full`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 group-hover:border-red-500/50 transition-colors">
                                        <card.icon size={28} className="text-slate-400 group-hover:text-red-400" />
                                    </div>
                                    <ChevronRight size={24} className="text-slate-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black heading-display">{card.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                                        {card.desc}
                                    </p>
                                </div>
                                <div className="h-1 w-0 bg-blue-500 group-hover:w-full transition-all duration-700"></div>
                            </NavLink>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none -z-10"></div>
        </section>
    );
};

export default Home;
