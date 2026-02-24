import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Briefcase } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const ProfileCard = ({ member, alternate }) => {
    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative flex flex-col md:flex-row gap-12 items-center premium-card p-12 bg-slate-950/20 backdrop-blur-3xl hover:bg-slate-900/40 transition-all duration-500 shadow-2xl ${alternate ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Visual Highlight */}
            <div className={`absolute top-0 bottom-0 w-1 bg-red-500 transition-all duration-700 opacity-0 group-hover:opacity-100 shadow-[0_0_20px_rgba(239,68,68,0.5)] ${alternate ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'}`}></div>

            {/* Photo Container */}
            <div className="relative flex-shrink-0 w-64 h-80">
                <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
                    <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=1e293b&color=fff&size=512` }}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-md text-[9px] font-bold text-white uppercase tracking-widest">
                        Verified
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] tracking-[0.2em] uppercase">
                        <Briefcase size={14} />
                        <span>Mentor Profile</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black heading-display text-white transition-colors group-hover:text-red-50 break-words overflow-hidden">
                        {member.name}
                    </h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="inline-block px-4 py-1.5 bg-slate-800 border border-white/10 rounded-lg">
                            <span className="text-slate-300 font-bold text-xs tracking-widest uppercase">{member.role}</span>
                        </div>
                        {member.expertise && (
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Areas of Expertise:</span>
                                <span className="text-red-400 font-bold text-xs uppercase tracking-wider">{member.expertise}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

                <p className="text-slate-400 leading-relaxed text-lg font-medium italic opacity-90 max-w-2xl">
                    "{member.bio}"
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-6">
                    <div className="flex gap-3">
                        {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 border border-white/5 hover:border-red-500/50 hover:bg-slate-800 rounded-xl transition-all group/link shadow-lg">
                                <Github size={20} className="text-slate-500 group-hover/link:text-red-400 transition-colors" />
                            </a>
                        )}
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 border border-white/5 hover:border-red-500/50 hover:bg-slate-800 rounded-xl transition-all group/link shadow-lg">
                                <Linkedin size={20} className="text-slate-500 group-hover/link:text-red-400 transition-colors" />
                            </a>
                        )}
                        {member.email && (
                            <a href={`mailto:${member.email}`} className="p-3 bg-slate-900 border border-white/5 hover:border-red-500/50 hover:bg-slate-800 rounded-xl transition-all group/link shadow-lg">
                                <Mail size={20} className="text-slate-500 group-hover/link:text-red-400 transition-colors" />
                            </a>
                        )}
                    </div>

                    <a href={member.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-red-600 text-white font-bold tracking-widest text-[10px] uppercase hover:bg-red-500 rounded-xl transition-all flex items-center gap-3 ml-auto shadow-xl shadow-red-900/20 active:scale-95">
                        Mentor Focus <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </Motion.div>
    );
};

export default ProfileCard;
