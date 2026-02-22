import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Globe, Mail, LogOut, ShieldCheck, GitBranch, Search } from 'lucide-react';

const HUD = ({ user, onLogout }) => {
    return (
        <header className="fixed inset-x-0 top-0 z-[60] w-full">
            <div className="w-full bg-slate-950/40 backdrop-blur-md border-b border-white/5 py-4 px-8 shadow-2xl">
                <div className="max-w-[1700px] mx-auto flex justify-between items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <NavLink to="/" className="group flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white group-hover:text-blue-500 transition-colors">SQUAD_139</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">{user ? user.role : 'PERSONNEL LOCKED'}</span>
                            </div>
                        </NavLink>
                    </motion.div>

                    {/* Navigation - Perfectly Balanced */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-x-12"
                    >
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
                                group flex items-center gap-2 transition-all duration-300
                                ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'}
                            `}
                            >
                                <link.icon size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{link.label}</span>
                            </NavLink>
                        ))}
                    </motion.nav>

                    <div className="flex items-center gap-8">
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <Search size={18} />
                        </button>

                        <div className="w-[1px] h-4 bg-white/10"></div>

                        {user ? (
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2.5 text-slate-500 hover:text-red-400 transition-all font-black uppercase text-[10px] tracking-[0.3em]"
                            >
                                <LogOut size={15} className="opacity-60" />
                                <span>EXIT</span>
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `
                                group flex items-center gap-2 transition-all duration-300
                                ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'}
                            `}
                            >
                                <ShieldCheck size={15} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">AUTH</span>
                            </NavLink>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default HUD;
