import React from 'react';
import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Users, Globe2, Briefcase } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Home = () => {
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 500], [1, 0.9]);
    const heroY = useTransform(scrollY, [0, 500], [0, -50]);
    const pillars = [
        {
            title: 'Folks',
            desc: 'The heart of our community. Connect with learners and alumni.',
            path: '/team',
            icon: Users,
            tag: 'Directory'
        },
        {
            title: 'Initiatives',
            desc: 'Real-world projects and learning tracks designed for growth.',
            path: '/expeditions',
            icon: Globe2,
            tag: 'Archive'
        },
        {
            title: 'Core Leadership',
            desc: 'The strategic team guiding the ecosystem\'s vision and clarity.',
            path: '/operatives',
            icon: Briefcase,
            tag: 'Leadership'
        }
    ];

    return (
        <section className="section-shell flex flex-col justify-center overflow-hidden bg-transparent">
            <div className="section-stack md:space-y-28">

                {/* ─── Elegant Hero (Centered) ─── */}
                <div className="max-w-6xl mx-auto text-center space-y-9 md:space-y-12">
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
                            Building Skills. <br />
                            <span className="text-red-500 italic drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">Shaping Careers.</span>
                        </h1>

                        <p className="section-copy md:text-xl font-medium max-w-2xl mx-auto opacity-80">
                            A mentor-driven learning ecosystem focused on real-world skills, clarity, and growth.
                        </p>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-12"></div>

                        <div className="flex justify-center w-full pt-4">
                            <button
                                onClick={() => document.getElementById('pillars').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative"
                            >
                                {/* Deep Ambient Glow */}
                                <div className="absolute -inset-8 bg-red-600 rounded-[4rem] blur-3xl opacity-5 group-hover:opacity-30 transition-opacity duration-1000"></div>

                                {/* The Command Button */}
                                <div className="relative flex items-center justify-center bg-red-600 text-white w-[270px] sm:w-[340px] h-18 sm:h-22 rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase shadow-[0_30px_70px_-15px_rgba(239,68,68,0.5)] active:scale-[0.98] transition-all duration-700 overflow-hidden border border-white/20">

                                    {/* Glass Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>

                                    {/* Centered Content */}
                                    <div className="flex items-center gap-4 relative z-10 translate-x-2">
                                        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black">Explore the Network</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                    </div>

                                    {/* Animated Scanner Scanline */}
                                    <Motion.div
                                        animate={{ top: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-x-0 h-8 bg-white/5 blur-md pointer-events-none"
                                    ></Motion.div>
                                </div>
                            </button>
                        </div>
                    </Motion.div>
                </div>

                {/* ─── Minimalist Pillars ─── */}
                <div id="pillars" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {pillars.map((card, i) => (
                        <Motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                        >
                            <NavLink
                                to={card.path}
                                className="group block panel-card p-14 sm:p-16 lg:p-24 hover:border-red-500/40 transition-all duration-700 h-full overflow-hidden relative"
                            >
                                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-500 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-500">
                                        <card.icon size={32} className="text-slate-400 group-hover:text-white transition-colors" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] font-black text-red-500 tracking-[0.4em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                                                {card.tag}
                                            </span>
                                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold heading-display group-hover:text-white transition-colors">
                                                {card.title}
                                            </h2>
                                        </div>

                                        <p className="text-sm sm:text-[15px] text-slate-400 font-medium leading-relaxed max-w-[240px]">
                                            {card.desc}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex items-center gap-3 text-red-500 text-[10px] font-black tracking-[0.3em] opacity-40 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-500">
                                        LEARN MORE <ArrowRight size={14} />
                                    </div>
                                </div>

                                {/* Animated Data Grid Background */}
                                <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                                </div>

                                {/* Premium Border Sweep */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                    <Motion.div
                                        animate={{
                                            rotate: [0, 360],
                                        }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,rgba(239,68,68,0.2)_320deg,transparent_360deg)]"
                                    />
                                </div>

                                {/* Decorative Background Element */}
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors"></div>
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
