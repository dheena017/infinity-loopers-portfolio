import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Mail, LogOut, ShieldCheck,
    Search, Home, Crown, GraduationCap, GitFork, Briefcase, X, ArrowRight
} from 'lucide-react';
import SquadLogo from './SquadLogo';
import { mentorData } from '../data/team';

const HUD = ({ user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const searchRef = useRef(null);

    const navLinks = [
        { path: '/', label: 'OVERVIEW', icon: Home },
        { path: '/operatives', label: 'CORE LEADERSHIP', icon: Crown },
        { path: '/mentors', label: 'MENTOR NETWORK', icon: GraduationCap },
        { path: '/team', label: 'FOLKS', icon: GitFork },
        { path: '/expeditions', label: 'INITIATIVES', icon: Briefcase },
        { path: '/transmissions', label: 'CONNECT', icon: Mail },
    ];

    // Search Database
    const searchDb = [
        ...navLinks.map(link => ({ title: link.label, path: link.path, type: 'Page' })),
        ...mentorData.map(m => ({ title: m.name, path: '/mentors', type: 'Mentor', sub: m.role })),
        { title: 'Member Login', path: '/login', type: 'Access' }
    ];

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const filtered = searchDb.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.sub && item.sub.toLowerCase().includes(searchQuery.toLowerCase()))
            ).slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

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
        if (user.role === 'secretary') navLinks.push({ path: '/secretary', label: 'DASHBOARD', icon: ShieldCheck });
    }

    const handleSelect = (path) => {
        navigate(path);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

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
                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 shrink-0">
                        {/* Functional Search System */}
                        <div ref={searchRef} className="relative hidden sm:block">
                            <AnimatePresence>
                                {isSearchOpen ? (
                                    <Motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 340, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="relative flex items-center group/search"
                                    >
                                        {/* --- FUTURISTIC CONTAINER --- */}
                                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-2xl group-focus-within/search:border-red-500/40 transition-all duration-500"></div>

                                        <input
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="System Search..."
                                            className="relative z-10 w-full bg-transparent pl-10 pr-16 py-3.5 rounded-2xl text-[11px] font-bold text-white placeholder-slate-600 outline-none transition-all uppercase tracking-[0.2em] h-13"
                                        />

                                        {/* Unique Scanner Icon (Status Indicator) */}
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                                        </div>

                                        <div className="absolute right-2 flex items-center gap-1 z-20">
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}

                                            {/* UNIQUE CIRCULAR COMMAND BUTTON */}
                                            <button className="relative group/btn w-10 h-10 flex items-center justify-center bg-slate-900 border border-white/10 rounded-full overflow-hidden transition-all hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-90">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                                <Search size={15} className="text-slate-400 group-hover/btn:text-red-500 group-hover/btn:scale-110 transition-all duration-500" />

                                                {/* Orbital Ring Animation */}
                                                <div className="absolute inset-0 border border-red-500/20 rounded-full scale-150 opacity-0 group-hover/btn:scale-100 group-hover/btn:opacity-100 transition-all duration-700"></div>
                                            </button>
                                        </div>

                                        {/* Suggestions Overlay */}
                                        <AnimatePresence>
                                            {suggestions.length > 0 && (
                                                <Motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full right-0 mt-4 w-full bg-[#080a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                                >
                                                    {suggestions.map((item, idx) => (
                                                        <button
                                                            key={`${item.title}-${idx}`}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); // Prevent blur
                                                                handleSelect(item.path);
                                                            }}
                                                            className="w-full text-left p-3 hover:bg-red-500/10 rounded-xl transition-all group flex items-center justify-between"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.title}</span>
                                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{item.type} {item.sub && `• ${item.sub}`}</span>
                                                            </div>
                                                            <ArrowRight size={14} className="text-red-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                        </button>
                                                    ))}
                                                </Motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Motion.div>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        aria-label="Search"
                                        className="text-slate-400 hover:text-red-500 transition-all duration-300 p-2.5 rounded-xl hover:bg-white/5"
                                    >
                                        <Search size={22} />
                                    </button>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>

                        {user ? (
                            <button
                                onClick={onLogout}
                                className="group flex items-center gap-2 sm:gap-4 bg-red-950/20 border border-red-500/30 px-3 sm:px-6 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-red-600/20 transition-all duration-500 active:scale-95"
                            >
                                <LogOut size={14} className="text-red-500 sm:w-4 sm:h-4" />
                                <span className="text-[9px] sm:text-[11px] font-black text-white tracking-[0.2em] uppercase">SIGN OUT</span>
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                className="group relative"
                            >
                                <div className="absolute -inset-1 bg-red-600/30 rounded-xl sm:rounded-2.5xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                <div className="relative flex items-center gap-1.5 sm:gap-4 bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-2 sm:px-8 py-1.5 sm:py-4 rounded-lg sm:rounded-[1.25rem] border border-white/30 shadow-2xl active:scale-95 transition-all duration-500">
                                    <div className="relative w-5 h-5 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:rotate-[360deg] transition-transform duration-1000">
                                        <ShieldCheck size={12} className="text-white sm:w-5 sm:h-5" />
                                    </div>
                                    <span className="text-[8px] sm:text-[12px] font-black uppercase text-white tracking-[0.05em] sm:tracking-[0.25em]">
                                        <span className="hidden xs:inline">MEMBER LOGIN</span>
                                        <span className="xs:hidden">LOGIN</span>
                                    </span>
                                </div>
                            </NavLink>
                        )}
                    </div>

                </div>

                <nav className="lg:hidden border-t border-white/5 px-2 py-1.5 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1.5 min-w-max">
                        {navLinks.map((link) => (
                            <NavLink
                                key={`mobile-${link.path}`}
                                to={link.path}
                                className={({ isActive }) => `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[8px] font-black tracking-tight uppercase whitespace-nowrap transition-all duration-300 ${isActive ? 'bg-red-600/15 text-white border border-red-500/30' : 'text-slate-500 hover:text-white border border-transparent hover:bg-white/5'}`}
                            >
                                <link.icon size={11} className={location.pathname === link.path ? 'text-red-500' : ''} />
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
