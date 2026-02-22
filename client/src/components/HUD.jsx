import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Globe, Mail, LogOut, ShieldCheck } from 'lucide-react';

const HUD = ({ user, onLogout }) => {
    return (
        <header className="fixed inset-x-0 top-0 z-[60] w-full">
            <div className="w-full bg-slate-950/40 backdrop-blur-xl border-b border-white/5 py-4 px-8 shadow-2xl">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">

                    {/* Brand / Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <NavLink to="/" className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white hover:text-blue-500 transition-colors">PORTFOLIO</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{user ? user.role : 'Guest Mode'}</span>
                            </div>
                        </NavLink>
                    </motion.div>


                    {/* Navigation */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-8"
                    >
                        {[
                            { path: '/', label: 'Dashboard', icon: LayoutDashboard },
                            { path: '/operatives', label: 'Projects', icon: UserCircle },
                            { path: '/expeditions', label: 'Global', icon: Globe },
                            { path: '/team', label: 'The Team', icon: Users },
                            { path: '/transmissions', label: 'Contact', icon: Mail },
                        ].map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `
                                group flex items-center gap-2.5 transition-all duration-300
                                ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'}
                            `}
                            >
                                <link.icon size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{link.label}</span>
                            </NavLink>
                        ))}

                        <div className="w-[1px] h-4 bg-white/10"></div>

                        {user ? (
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2.5 text-slate-400 hover:text-red-400 transition-all font-bold uppercase text-[11px] tracking-wider"
                            >
                                <LogOut size={16} className="opacity-60" />
                                <span>Sign Out</span>
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `
                                group flex items-center gap-2.5 transition-all duration-300
                                ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'}
                            `}
                            >
                                <ShieldCheck size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">Admin Login</span>
                            </NavLink>
                        )}
                    </motion.nav>

                </div>
            </div>
        </header>
    );
};

export default HUD;
