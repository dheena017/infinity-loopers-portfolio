import React from 'react';
import { motion as Motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserCircle, Globe,
    Mail, LogOut, ShieldCheck,
    Search
} from 'lucide-react';
import SquadLogo from './SquadLogo';

const HUD = ({ user, onLogout }) => {
    const location = useLocation();
    const navLinks = [
        { path: '/', label: 'HOME', icon: LayoutDashboard },
        { path: '/operatives', label: 'LEADERSHIP', icon: UserCircle },
        { path: '/mentors', label: 'MENTORS', icon: Users },
        { path: '/team', label: 'FORK', icon: Users },
        { path: '/expeditions', label: 'PROJECTS', icon: Globe },
        { path: '/transmissions', label: 'ABOUT US', icon: Mail },
    ];

    if (user) {
        if (user.role === 'teacher') navLinks.push({ path: '/admin', label: 'DASHBOARD', icon: ShieldCheck });
        if (user.role === 'student') navLinks.push({ path: '/student', label: 'DASHBOARD', icon: ShieldCheck });
        if (user.role === 'secretary') navLinks.push({ path: '/secretary', label: 'DASHBOARD', icon: ShieldCheck });
    }

    // Helper for active link styles
    const getLinkClass = (isActive) => `
        relative px-6 py-2.5 group flex flex-col items-center gap-1.5 transition-all duration-700
        ${isActive ? 'text-red-500' : 'text-slate-500 hover:text-white'}
    `;

    return (
        <header className="fixed inset-x-0 top-0 z-[60] w-full px-2 sm:px-6 py-2.5 sm:py-6 pointer-events-none">
            <Motion.div
                initial={{ y: -100, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                className="max-w-[2000px] mx-auto bg-[#080a0f]/90 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden pointer-events-auto relative group"
            >
                {/* --- INDUSTRIAL FX LAYER --- */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

                {/* System Integrity Bar */}
                <div className="absolute top-0 inset-x-0 h-[3px] flex">
                    <Motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    ></Motion.div>
                </div>

                <div className="flex items-center justify-between px-3 sm:px-8 lg:px-16 py-3 sm:py-6 relative gap-3 sm:gap-4">

                    {/* --- SECTION 1: IDENTITY & LOGO --- */}
                    <div className="flex items-center gap-3 sm:gap-8 lg:gap-16 min-w-0">
                        <NavLink to="/" className="flex items-center gap-4 sm:gap-6 lg:gap-10 group/logo relative">
                            {/* Orbital Spinner */}
                            <div className="relative shrink-0">
                                <Motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border-[1.5px] border-red-500/20 rounded-2xl border-dashed"
                                ></Motion.div>
                                <Motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-2 border-[1px] border-red-500/10 rounded-full"
                                ></Motion.div>

                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-black border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl group-hover/logo:border-red-500/50 transition-all duration-500 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                                    <SquadLogo size={42} className="filter drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                                    <Motion.div
                                        animate={{ top: ['-100%', '200%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-x-0 h-4 bg-red-500/10 blur-sm pointer-events-none"
                                    ></Motion.div>
                                </div>
                            </div>

                            <div className="hidden xl:flex flex-col border-l border-white/10 pl-8">
                                <span className="text-3xl font-black tracking-[-0.05em] uppercase text-white leading-none group-hover/logo:text-red-500 transition-colors">SQUAD_139</span>
                                {user && (
                                    <span className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase mt-2">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                        </NavLink>
                    </div>

                    {/* --- SECTION 2: NAVIGATION BRIDGE --- */}
                    <nav className="hidden lg:flex items-center justify-center gap-x-4 xl:gap-x-6 flex-1 px-6 xl:px-16">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => getLinkClass(isActive)}
                            >
                                <div className="relative">
                                    {location.pathname === link.path && (
                                        <Motion.div
                                            layoutId="nav-aura"
                                            className="absolute -inset-4 bg-red-600/10 rounded-full blur-xl"
                                        />
                                    )}
                                    <link.icon size={16} className={`relative z-10 transition-all duration-700 ${location.pathname === link.path ? 'scale-125 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'opacity-40 filter grayscale hover:grayscale-0'}`} />
                                </div>
                                <span className={`text-[10px] font-black tracking-[0.3em] mt-1 relative z-10 ${location.pathname === link.path ? 'text-white' : ''}`}>
                                    {link.label}
                                </span>
                                {location.pathname === link.path && (
                                    <Motion.div
                                        layoutId="active-bracket"
                                        className="absolute -bottom-1 h-[2px] w-8 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                                    />
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* --- SECTION 3: OPERATIONS --- */}
                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 shrink-0">
                        <button aria-label="Search" className="hidden sm:inline-flex text-slate-400 hover:text-red-500 transition-all duration-300 p-2.5">
                            <Search size={22} className="drop-shadow-[0_0_8px_rgba(239,68,68,0)] group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        </button>

                        <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>

                        {user ? (
                            <button
                                onClick={onLogout}
                                className="group flex items-center gap-3 sm:gap-4 bg-red-950/20 border border-red-500/30 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl hover:bg-red-600/20 transition-all duration-500 active:scale-95"
                            >
                                <LogOut size={16} className="text-red-500" />
                                <span className="text-[10px] sm:text-[11px] font-black text-white tracking-[0.2em] uppercase">SIGN OUT</span>
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                className="group relative"
                            >
                                <div className="absolute -inset-2 bg-red-600/30 rounded-2.5xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                <div className="relative flex items-center gap-3 sm:gap-4 bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-4 sm:px-8 py-3 sm:py-4 rounded-[1.25rem] border border-white/30 shadow-[0_15px_40px_-5px_rgba(220,38,38,0.5)] active:scale-95 transition-all duration-500">
                                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:rotate-[360deg] transition-transform duration-1000">
                                        <ShieldCheck size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                    </div>
                                    <span className="text-[10px] sm:text-[12px] font-black uppercase text-white tracking-[0.2em] sm:tracking-[0.25em]">LOGIN PORTAL</span>
                                </div>
                            </NavLink>
                        )}
                    </div>

                </div>

                <nav className="lg:hidden border-t border-white/10 px-2 py-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1 min-w-max">
                        {navLinks.map((link) => (
                            <NavLink
                                key={`mobile-${link.path}`}
                                to={link.path}
                                className={({ isActive }) => `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black tracking-[0.16em] uppercase whitespace-nowrap transition-colors ${isActive ? 'bg-red-600/20 text-red-400 border border-red-500/40' : 'text-slate-400 hover:text-white border border-transparent hover:border-white/10'}`}
                            >
                                <link.icon size={13} />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </Motion.div>
        </header>
    );
};

export default HUD;
