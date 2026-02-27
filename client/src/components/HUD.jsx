import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Mail, LogOut, ShieldCheck,
    Search, Home, Crown, GraduationCap, GitFork, Briefcase, X, Menu
} from 'lucide-react';
import SquadLogo from './SquadLogo';

const HUD = ({ user, onLogout }) => {
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef(null);

    const navLinks = [
        { path: '/', label: 'OVERVIEW', icon: Home },
        { path: '/operatives', label: 'CORE LEADERSHIP', icon: Crown },
        { path: '/mentors', label: 'MENTOR NETWORK', icon: GraduationCap },
        { path: '/team', label: 'FOLKS', icon: GitFork },
        { path: '/expeditions', label: 'INITIATIVES', icon: Briefcase },
        { path: '/transmissions', label: 'CONNECT', icon: Mail },
    ];

    // Handle Click Outside Search
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (user) {
        if (user.role === 'mentor') navLinks.push({ path: '/mentor', label: 'MENTOR DASHBOARD', icon: ShieldCheck });
        if (user.role === 'student') navLinks.push({ path: '/student', label: 'DASHBOARD', icon: ShieldCheck });
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
                className="max-w-[2000px] mx-auto bg-[#080a0f]/90 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-auto relative group"
            >
                {/* --- INDUSTRIAL FX LAYER --- */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] rounded-[2.5rem]"></div>

                {/* System Integrity Bar */}
                <div className="absolute top-0 inset-x-0 h-[3px] flex">
                    <Motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    ></Motion.div>
                </div>

                <div className="flex items-center justify-between px-2.5 sm:px-8 lg:px-16 py-1.5 sm:py-6 relative gap-2 sm:gap-4">

                    {/* --- SECTION 1: IDENTITY & LOGO --- */}
                    <div className="flex items-center gap-2 sm:gap-8 lg:gap-16 min-w-0">
                        <NavLink to="/" className="flex items-center gap-2 sm:gap-6 lg:gap-10 group/logo relative">
                            {/* Orbital Spinner */}
                            <div className="relative shrink-0">
                                <div className="relative w-8 h-8 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-black border border-white/20 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-2xl group-hover/logo:border-red-500/50 transition-all duration-500 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                                    <SquadLogo size={20} className="filter drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] sm:scale-150" />
                                </div>
                            </div>

                            <div className="hidden xl:flex flex-col border-l border-white/10 pl-8">
                                <span className="text-3xl font-black tracking-[-0.05em] uppercase text-white leading-none group-hover/logo:text-red-500 transition-colors">SQUAD 139</span>
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
                    <div className="flex items-center gap-2 sm:gap-6 lg:gap-10 shrink-0">
                        {/* Search System */}
                        <div ref={searchRef} className="relative">
                            <AnimatePresence>
                                {isSearchOpen ? (
                                    <Motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: window.innerWidth < 640 ? 200 : 340, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="relative flex items-center group/search"
                                    >
                                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl transition-all duration-500"></div>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="relative z-10 w-full bg-transparent pl-8 sm:pl-10 pr-10 py-2 sm:py-3.5 rounded-2xl text-[10px] sm:text-[11px] font-bold text-white placeholder-slate-600 outline-none uppercase tracking-widest h-10 sm:h-13"
                                        />
                                        <div className="absolute right-2 flex items-center z-20">
                                            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1.5 text-slate-500 hover:text-white"><X size={14} /></button>
                                        </div>
                                    </Motion.div>
                                ) : (
                                    <button onClick={() => setIsSearchOpen(true)} className="text-slate-400 hover:text-red-500 p-2 sm:p-2.5 rounded-xl hover:bg-white/5 transition-all"><Search size={20} className="sm:w-[22px] sm:h-[22px]" /></button>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>

                        {/* DESKTOP LOGIN/LOGOUT */}
                        <div className="hidden lg:block">
                            {user ? (
                                <button onClick={onLogout} className="group flex items-center gap-4 bg-red-950/20 border border-red-500/30 px-6 py-4 rounded-2xl hover:bg-red-600/20 transition-all">
                                    <LogOut size={16} className="text-red-500" />
                                    <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase">SIGN OUT</span>
                                </button>
                            ) : (
                                <NavLink to="/login" className="group relative">
                                    <div className="relative flex items-center gap-4 bg-gradient-to-br from-red-600 to-red-900 px-8 py-4 rounded-[1.25rem] border border-white/30 shadow-2xl active:scale-95 transition-all">
                                        <ShieldCheck size={20} className="text-white" />
                                        <span className="text-[12px] font-black uppercase text-white tracking-[0.25em]">MEMBER LOGIN</span>
                                    </div>
                                </NavLink>
                            )}
                        </div>

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-red-600/20 transition-all"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE SIDEBAR --- */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <Motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[280px] bg-slate-950/95 backdrop-blur-[50px] border-l border-white/10 z-[100] p-10 flex flex-col justify-between shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
                        >
                            <div className="space-y-12">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                                    <div className="w-10 h-10 bg-red-600/10 border border-red-500/30 rounded-xl flex items-center justify-center">
                                        <SquadLogo size={24} />
                                    </div>
                                    <span className="text-lg font-black text-white tracking-widest uppercase italic">SQUAD HQ</span>
                                </div>

                                <nav className="flex flex-col gap-6">
                                    {navLinks.map((link) => (
                                        <NavLink
                                            key={`side-${link.path}`}
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-xl transition-all ${isActive ? 'bg-red-600/20 text-white border border-red-500/40 shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <link.icon size={18} className={location.pathname === link.path ? 'text-red-500' : ''} />
                                            <span className="text-xs font-black tracking-[0.2em] uppercase">{link.label}</span>
                                        </NavLink>
                                    ))}
                                </nav>
                            </div>

                            <div className="space-y-6">
                                {user ? (
                                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center gap-4 py-5 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-500 font-bold uppercase tracking-widest text-[10px]">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                ) : (
                                    <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-4 py-5 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-2xl">
                                        <ShieldCheck size={16} /> Member Login
                                    </NavLink>
                                )}
                            </div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </Motion.div>
        </header>
    );
};

export default HUD;

