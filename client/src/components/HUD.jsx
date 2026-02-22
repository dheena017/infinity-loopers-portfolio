import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Globe, Signal, Activity, Shield } from 'lucide-react';

const HUD = ({ user, onLogout }) => {
    return (
        <div className="fixed inset-x-0 top-0 z-[60] pointer-events-none p-12">
            <div className="container-premium flex justify-between items-start w-full gap-6">

                {/* Brand / Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="pointer-events-auto group shrink-0"
                >
                    <NavLink to="/" className="flex flex-col">
                        <span className="text-xl font-black italic tracking-tighter text-white group-hover:text-cyan-400 transition-colors font-space">SQUAD_139</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                            <span className="font-mono-tech !text-[7px] uppercase tracking-widest">{user ? user.role : 'Guest_Mode'}</span>
                        </div>
                    </NavLink>
                </motion.div>

                {/* Minimalist Navigation */}
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-auto glass-panel px-8 py-4 flex items-center gap-8 rounded-sm overflow-x-auto"
                >
                    {[
                        { path: '/', label: 'Overview', icon: LayoutDashboard },
                        { path: '/operatives', label: 'Operatives', icon: UserCircle },
                        { path: '/expeditions', label: 'Expeditions', icon: Globe },
                        { path: '/the-crew', label: 'The Crew', icon: Users },
                        { path: '/transmissions', label: 'Relay', icon: Signal },
                    ].map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `
                                group flex items-center gap-3 transition-all duration-500 shrink-0
                                ${isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}
                            `}
                        >
                            <link.icon size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] font-space">{link.label}</span>
                        </NavLink>
                    ))}

                    <div className="w-[1px] h-4 bg-white/10 mx-2"></div>

                    {user ? (
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 text-red-500/50 hover:text-red-500 transition-all group shrink-0"
                        >
                            <Activity size={14} className="opacity-40 group-hover:opacity-100" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] font-space">Disconnect</span>
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) => `
                                group flex items-center gap-3 transition-all duration-500 shrink-0
                                ${isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}
                            `}
                        >
                            <Shield size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] font-space">Auth_Gate</span>
                        </NavLink>
                    )}
                </motion.nav>

                {/* Status Readout */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="pointer-events-auto hidden lg:flex flex-col items-end gap-3 text-right shrink-0"
                >
                    <div className="flex items-center gap-4 text-cyan-500/40">
                        <Signal size={12} />
                        <span className="font-mono-tech !text-[7px]">Comm_Link: {user ? 'Encrypted' : 'Open'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-[9px] font-black italic text-gray-500 uppercase tracking-widest">
                            {user ? `User: ${user.username}` : 'Sector_Coord: 001.03.IX'}
                        </div>
                        <Activity size={10} className="text-white/20" />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default HUD;

