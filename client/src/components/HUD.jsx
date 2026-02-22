import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Globe, Mail, LogOut, ShieldCheck, GitBranch, Search } from 'lucide-react';

const HUD = ({ user, onLogout }) => {
    return (
        <header className="fixed inset-x-0 top-0 z-[60] w-full">
            <div className="w-full bg-slate-950/40 backdrop-blur-md border-b border-white/5 py-4 px-8 shadow-2xl">
                <div className="max-w-[1700px] mx-auto flex justify-between items-center text-white">

                    {/* Brand / Logo Section */}
                    <NavLink to="/" className="group flex items-center gap-6 pb-2 pt-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="relative group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute -inset-2 bg-red-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative w-16 h-16 bg-[#000000] border border-white/10 rounded-xl flex items-center justify-center p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,1)] overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <img
                                        src="https://kalvium.com/wp-content/uploads/2023/04/Kalvium-Logo.svg"
                                        alt="Kalvium"
                                        className="w-full h-full object-contain filter drop-shadow-2xl"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <div className="hidden lg:flex flex-col border-l-2 border-white/10 pl-6 gap-0.5">
                            <span className="text-xl font-black tracking-tighter uppercase group-hover:text-red-500 transition-colors">SQUAD_139</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">
                                    {user ? user.role : 'IDENTITY LOCKED'}
                                </span>
                            </div>
                        </div>
                    </NavLink>

                    {/* Navigation - Centered & Balanced */}
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
                                    group flex items-center gap-2.5 transition-all duration-300
                                    ${isActive ? 'text-red-500' : 'text-slate-400 hover:text-white'}
                                `}
                            >
                                <link.icon size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{link.label}</span>
                            </NavLink>
                        ))}
                    </motion.nav>

                    {/* Right Side Tools */}
                    <div className="flex items-center gap-8">
                        <button className="text-slate-500 hover:text-red-500 transition-colors">
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
                                    group flex items-center gap-2.5 transition-all duration-300
                                    ${isActive ? 'text-red-500' : 'text-slate-400 hover:text-white'}
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
