import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Users, Globe2, Briefcase, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Home = () => {
    const pillars = [
        {
            title: 'Collective',
            desc: 'Internal personnel directory and operative profiles.',
            path: '/collective',
            icon: Users,
            tag: 'Directory'
        },
        {
            title: 'Expeditions',
            desc: 'Comprehensive archive of global technical breakthroughs.',
            path: '/expeditions',
            icon: Globe2,
            tag: 'Archive'
        },
        {
            title: 'Operatives',
            desc: 'Strategic leadership and core project architects.',
            path: '/operatives',
            icon: Briefcase,
            tag: 'Leadership'
        }
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 overflow-hidden bg-transparent">
            <div className="container-premium space-y-32">

                {/* ─── Elegant Hero ─── */}
                <div className="max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[2px] bg-red-600"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-red-500">v3.0 Core Active</span>
                        </div>

                        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black heading-display leading-[0.9] tracking-tighter text-white">
                            DESIGN MEETS <br />
                            <span className="text-red-500 italic drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">ENGINEERING.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl opacity-80">
                            Explore the cold expanse of code through a high-performance ecosystem designed for the next generation of digital infrastructure.
                        </p>

                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            <NavLink to="/collective" className="group relative">
                                <div className="absolute -inset-2 bg-red-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative flex items-center gap-8 bg-red-600 text-white px-16 py-8 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg active:scale-95 transition-all shadow-[0_20px_60px_-15px_rgba(239,68,68,0.5)]">
                                    Initialize Sequence <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
                                </div>
                            </NavLink>
                        </div>
                    </motion.div>
                </div>

                {/* ─── Minimalist Pillars ─── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {pillars.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                        >
                            <NavLink
                                to={card.path}
                                className="group block premium-card p-12 bg-slate-950/40 border-white/5 hover:border-red-500/40 transition-all duration-500 h-full overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-12">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-600/10 group-hover:border-red-500/50 transition-all">
                                        <card.icon size={24} className="text-slate-500 group-hover:text-red-500 transition-colors" />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 tracking-[0.3em] uppercase">{card.tag}</span>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black heading-display group-hover:text-white transition-colors">{card.title}</h3>
                                    <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
                                        {card.desc}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center gap-2 text-red-500 text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    EXPLORE <ArrowRight size={12} />
                                </div>
                            </NavLink>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        </section>
    );
};

export default Home;
