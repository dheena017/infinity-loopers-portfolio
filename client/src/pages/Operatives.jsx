import React from 'react';
import { motion as Motion } from 'framer-motion';
import { teamData } from '../data/team';
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
                            Advisory Team
                        </div>
                        <h2 className="section-heading">Leadership <span className="text-red-500">Team</span></h2>
                        <p className="section-copy max-w-lg">
                            An experienced group of mentors and strategists dedicated to guiding learners through their technical and professional growth.
                        </p>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="panel-card p-8 lg:p-10 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4 text-slate-200">
                            <Star size={20} className="text-amber-500" />
                            <span className="font-bold text-lg heading-display">Supportive Guidance</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Our leadership focuses on creating a nurturing environment where skill growth and real-world readiness are the top priorities.
                        </p>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span>Experience-Driven</span>
                            <span>Community Focused</span>
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
            </div>
        </section>
    );
};

export default Operatives;
