import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserCircle, Globe,
    Mail, LogOut, ShieldCheck, GitBranch,
    Search, Activity, Cpu, Wifi
} from 'lucide-react';

const HUD = ({ user, onLogout }) => {
    const location = useLocation();
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-[60] w-full px-4 sm:px-8 py-6 pointer-events-none">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="max-w-[1920px] mx-auto bg-slate-950/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden pointer-events-auto relative group"
            >
                {/* Subtle Scanline Effect */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-in-out"></div>

                <div className="flex items-center justify-between px-8 py-3.5 relative">

                    {/* --- LEFT: LOGO & TELEMETRY --- */}
                    <div className="flex items-center gap-8">
                        <NavLink to="/" className="flex items-center gap-6 group/logo">
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-3 border border-red-500/10 rounded-full border-dashed"
                                ></motion.div>
                                <div className="relative w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center p-3 shadow-[0_0_30px_rgba(239,68,68,0.1)] group-hover/logo:border-red-500/30 transition-all duration-500 overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20"></div>
                                    <img
                                        src="https://kalvium.com/wp-content/uploads/2023/04/Kalvium-Logo.svg"
                                        alt="Kalvium"
                                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                    />
                                </div>
                            </div>

                            <div className="hidden xl:flex flex-col border-l border-white/10 pl-6 space-y-1">
                                <span className="text-xl font-black tracking-tighter uppercase text-white leading-none">SQUAD_139</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [4, 10, 4] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                                className="w-0.5 bg-red-500/50"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[8px] font-black tracking-[0.5em] text-slate-500 uppercase">
                                        {user ? user.role : 'IDENTITY_LOCKED'}
                                    </span>
                                </div>
                            </div>
                        </NavLink>

                        {/* Telemetry Dots */}
                        <div className="hidden 2xl:flex items-center gap-6 border-l border-white/5 pl-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Activity size={10} className="text-red-500/60" />
                                    <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">Vitals: Optimal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wifi size={10} className="text-blue-500/60" />
                                    <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">Uplink: Live</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CENTER: CORE NAV --- */}
                    <nav className="hidden lg:flex items-center justify-center gap-x-2 flex-1 px-8">
                        {[
                            { path: '/', label: 'HOME', icon: LayoutDashboard },
                            { path: '/operatives', label: 'ADVISORS', icon: UserCircle },
                            { path: '/team', label: 'MENTORS', icon: ShieldCheck },
                            { path: '/structure', label: 'STRUCTURE', icon: GitBranch },
                            { path: '/expeditions', label: 'PROJECTS', icon: Globe },
                            { path: '/collective', label: 'THE TEAM', icon: Users },
                            { path: '/transmissions', label: 'CONTACT', icon: Mail },
                        ].map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `
                                    relative px-5 py-2 group flex flex-col items-center gap-1.5 transition-all duration-500
                                    ${isActive ? 'text-red-500' : 'text-slate-400 hover:text-white'}
                                `}
                            >
                                <link.icon size={15} className={`transition-all duration-500 ${location.pathname === link.path ? 'scale-110 opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`} />
                                <span className="text-[9px] font-black tracking-[0.25em]">{link.label}</span>

                                <AnimatePresence>
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute -inset-x-1 -inset-y-1 bg-red-500/5 rounded-xl -z-10 blur-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                </AnimatePresence>
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="nav-line"
                                        className="h-0.5 w-6 bg-red-500 rounded-full absolute -bottom-1"
                                    />
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* --- RIGHT: OPERATIONS --- */}
                    <div className="flex items-center gap-8 shrink-0">
                        {/* Status Clock */}
                        <div className="hidden sm:flex flex-col items-end leading-none">
                            <span className="text-[12px] font-black tracking-widest text-white/90">{time}</span>
                            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Mission Clock</span>
                        </div>

                        <div className="w-[1px] h-8 bg-white/10 mx-2"></div>

                        {user ? (
                            <button
                                onClick={onLogout}
                                className="group flex items-center gap-4 bg-red-950/20 border border-red-500/20 px-6 py-3 rounded-2xl hover:bg-red-500/20 transition-all duration-300 active:scale-95"
                            >
                                <LogOut size={16} className="text-red-500 group-hover:rotate-12 transition-transform" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[11px] font-black text-white tracking-widest">SIGN OUT</span>
                                    <span className="text-[7px] font-bold text-red-500/60 tracking-widest">TERMINATE</span>
                                </div>
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                className="group relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                <div className="relative flex items-center gap-4 bg-gradient-to-br from-red-600 to-red-800 px-7 py-3.5 rounded-2xl border border-white/20 shadow-2xl active:scale-95 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:rotate-6 transition-transform">
                                        <ShieldCheck size={18} className="text-white" />
                                    </div>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[12px] font-black uppercase text-white tracking-widest">ACCESS PORTAL</span>
                                        <span className="text-[7px] font-bold text-red-100/60 uppercase tracking-[0.2em] mt-0.5">AUTHORIZE</span>
                                    </div>
                                </div>
                            </NavLink>
                        )}
                    </div>

                </div>
            </motion.div>
        </header>
    );
};

export default HUD;
