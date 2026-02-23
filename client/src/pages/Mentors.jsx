import React from 'react';
import { motion as Motion } from 'framer-motion';
import { mentorData } from '../data/team';
import { Users, ChevronRight, Briefcase } from 'lucide-react';

const Mentors = () => {
    return (
        <section className="section-shell">
            <div className="section-stack md:space-y-28">
                {/* Header */}
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-widest mx-auto">
                        <Users size={14} />
                        Professional Guidance
                    </div>
                    <h2 className="section-heading">Board of <br /><span className="text-red-500">Advisors</span></h2>
                    <p className="section-copy max-w-lg mx-auto">
                        Experienced industry leaders providing strategic direction and technical architectural oversight.
                    </p>
                </Motion.div>

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {mentorData.map((mentor, idx) => (
                        <Motion.div
                            key={mentor.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="panel-card p-6 lg:p-8 flex items-center gap-6 lg:gap-8 group"
                        >
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-white/5 relative flex-shrink-0 bg-slate-950">
                                <img 
                                    src={mentor.photo} 
                                    alt={mentor.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${mentor.name}&background=1e293b&color=fff&size=512`; }}
                                />
                                <div className="absolute inset-0 bg-red-500/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            
                            <div className="space-y-3 flex-1">
                                <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
                                    {mentor.role}
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black heading-display text-white group-hover:text-red-50 transition-colors leading-tight">
                                    {mentor.name}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                                    {mentor.desc}
                                </p>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-500">
                                <ChevronRight size={24} className="text-red-500" />
                            </div>
                        </Motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mentors;
