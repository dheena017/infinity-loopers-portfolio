import React from 'react';
import { motion as Motion } from 'framer-motion';
import { teamData, mentorData } from '../data/team';
import ProfileCard from '../components/ProfileCard';
import { Briefcase, ChevronRight, Star, Users } from 'lucide-react';

const Operatives = () => {
    return (
        <section className="section-shell">
            <div className="section-stack md:space-y-28">

                {/* Section Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-widest">
                            <Briefcase size={14} />
                            Strategic Leadership
                        </div>
                        <h2 className="section-heading">Core <br /><span className="text-red-500">Advisory</span> Team</h2>
                        <p className="section-copy max-w-lg">
                            A highly specialized unit of architects and engineers focused on delivering high-performance digital ecosystems.
                        </p>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="panel-card p-8 lg:p-10 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4 text-slate-200">
                            <Star size={20} className="text-amber-500" />
                            <span className="font-bold text-lg heading-display">Industry Recognition</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Our team members have been recognized for excellence in system architecture, UI/UX innovation, and performant cloud engineering.
                        </p>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span>Certified Experts</span>
                            <span>2024 Verified</span>
                        </div>
                    </Motion.div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 gap-12">
                    {teamData.map((member, idx) => (
                        <Motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ProfileCard member={member} alternate={idx % 2 !== 0} />
                        </Motion.div>
                    ))}
                </div>

                {/* Mentors Section */}
                <div className="space-y-16">
                    <div className="flex items-center gap-6">
                        <Users size={24} className="text-red-500" />
                        <h3 className="text-4xl font-black heading-display">Board of Advisors</h3>
                        <div className="h-px flex-1 bg-white/5"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {mentorData.map((mentor, idx) => (
                            <Motion.div
                                key={mentor.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="panel-card p-6 lg:p-8 flex items-center gap-6 lg:gap-8 group"
                            >
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 relative">
                                    <img src={mentor.photo} alt={mentor.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-red-500/10 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">Advisory Board</div>
                                    <h4 className="text-xl font-bold heading-display text-white">{mentor.name}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{mentor.role}</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={20} className="text-slate-600" />
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Operatives;
