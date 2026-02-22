import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Users, Globe2, Briefcase } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Home = () => {
    const pillars = [
        {
            title: 'Collective',
            desc: 'Internal personnel directory and operative profiles.',
            path: '/team',
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
        <section className="section-shell flex flex-col justify-center overflow-hidden bg-transparent">
            <div className="section-stack md:space-y-28">

                {/* ─── Elegant Hero (Centered) ─── */}
                <div className="max-w-5xl mx-auto text-center space-y-9 md:space-y-12">
                    <Motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8 flex flex-col items-center"
                    >
                        <div className="flex items-center gap-4 justify-center">
                            <span className="w-12 h-[2px] bg-red-600"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-red-500">v3.0 Core Active</span>
                            <span className="w-12 h-[2px] bg-red-600"></span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black heading-display leading-[0.9] tracking-tighter text-white">
                            DESIGN MEETS <br />
                            <span className="text-red-500 italic drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">ENGINEERING.</span>
                        </h1>

                        <p className="section-copy md:text-xl font-medium max-w-2xl mx-auto opacity-80">
                            Explore the cold expanse of code through a high-performance ecosystem designed for the next generation of digital infrastructure.
                        </p>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-12"></div>

                        <div className="flex justify-center w-full pt-4">
                            <NavLink to="/team" className="group relative">
                                {/* Deep Ambient Glow */}
                                <div className="absolute -inset-8 bg-red-600 rounded-[4rem] blur-3xl opacity-5 group-hover:opacity-30 transition-opacity duration-1000"></div>

                                {/* The Command Button */}
                                <div className="relative flex items-center justify-center bg-red-600 text-white w-[270px] sm:w-[320px] h-16 sm:h-20 rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase shadow-[0_30px_70px_-15px_rgba(239,68,68,0.5)] active:scale-[0.98] transition-all duration-700 overflow-hidden border border-white/20">

                                    {/* Glass Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>

                                    {/* Centered Content */}
                                    <div className="flex items-center gap-4 relative z-10 translate-x-2">
                                        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black">Initialize Sequence</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                    </div>

                                    {/* Animated Scanner Scanline */}
                                    <Motion.div
                                        animate={{ top: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-x-0 h-8 bg-white/5 blur-md pointer-events-none"
                                    ></Motion.div>
                                </div>
                            </NavLink>
                        </div>
                    </Motion.div>
                </div>

                {/* ─── Minimalist Pillars ─── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {pillars.map((card, i) => (
                        <Motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                        >
                            <NavLink
                                to={card.path}
                                className="group block panel-card p-6 sm:p-8 lg:p-10 hover:border-red-500/40 transition-all duration-500 h-full overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-8 sm:mb-12">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-600/10 group-hover:border-red-500/50 transition-all">
                                        <card.icon size={24} className="text-slate-500 group-hover:text-red-500 transition-colors" />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 tracking-[0.3em] uppercase">{card.tag}</span>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black heading-display group-hover:text-white transition-colors">{card.title}</h2>
                                    <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
                                        {card.desc}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center gap-2 text-red-500 text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    EXPLORE <ArrowRight size={12} />
                                </div>
                            </NavLink>
                        </Motion.div>
                    ))}
                </div>

            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-amber-400/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        </section>
    );
};

export default Home;
