import React from 'react';
import { motion } from 'framer-motion';
import { teamData, mentorData } from '../data/team';
import ProfileCard from '../components/ProfileCard';
import { Shield, Zap, Target, Activity, Cpu } from 'lucide-react';

const Operatives = () => {
    return (
        <section className="py-64 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-10"></div>

            <div className="container-premium relative z-10 w-full">
                {/* Section Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-48 items-end">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <div className="flex items-center gap-6 text-cyan-500">
                            <Shield size={12} className="animate-pulse" />
                            <span className="font-mono-tech !text-[9px]">Authorization_Level: Delta</span>
                        </div>
                        <h2 className="text-9xl font-black italic tracking-tighter uppercase leading-none text-white font-space">
                            COMMAND<br />
                            <span className="text-cyan-500 glow-text">OPERATIVES</span>
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 pb-4"
                    >
                        <p className="text-xl text-gray-500 italic leading-relaxed border-l border-white/10 pl-12">
                            A specialized unit of digital architects and systems thinkers, dedicated to the advancement of cosmic-scale user experiences.
                        </p>
                    </motion.div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {teamData.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15 }}
                        >
                            <ProfileCard member={member} />
                        </motion.div>
                    ))}
                </div>

                {/* Mentors / Advisors Section */}
                <div className="mt-64 space-y-24">
                    <div className="flex items-center gap-8">
                        <div className="h-[1px] flex-1 bg-white/5"></div>
                        <span className="font-mono-tech !text-[8px] !opacity-30">Advisory_Intelligence</span>
                        <div className="h-[1px] flex-1 bg-white/5"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {mentorData.map((mentor, idx) => (
                            <motion.div
                                key={mentor.id}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="glass-card p-12 flex items-center gap-12 group hover:border-cyan-500/30 transition-all duration-700"
                            >
                                <div className="w-24 h-24 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10">
                                    <img src={mentor.photo} alt={mentor.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-2">
                                    <div className="font-mono-tech !text-[7px] !text-cyan-400">Mentor_{mentor.id}</div>
                                    <h3 className="text-2xl font-black italic text-white uppercase font-space">{mentor.name}</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{mentor.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Operatives;
