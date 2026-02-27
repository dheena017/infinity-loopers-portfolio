import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Briefcase } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const ProfileCard = ({ member, alternate, badge = "Member Profile" }) => {
    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative flex flex-col md:flex-row gap-8 md:gap-16 items-center premium-card p-6 md:p-12 transition-all duration-700 ${alternate ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Visual Highlight */}
            <div className={`absolute top-0 bottom-0 w-1 bg-red-600 transition-all duration-700 opacity-0 group-hover:opacity-100 shadow-[0_0_30px_rgba(220,38,38,0.6)] ${alternate ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'}`}></div>

            {/* Photo Container */}
            <div className="relative flex-shrink-0 w-full max-w-[320px] md:w-64 lg:w-72 aspect-[4/5] md:h-auto">
                <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
                    <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=1e293b&color=fff&size=512` }}
                    />

                    {/* Shine Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1s_ease-in-out] pointer-events-none"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-md text-[9px] font-bold text-white uppercase tracking-widest">
                        Verified
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow space-y-8 md:pl-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-red-600 font-bold text-[10px] tracking-[0.35em] uppercase opacity-80">
                        <div className="w-8 h-[1px] bg-red-600/40"></div>
                        <Briefcase size={14} />
                        <span>{badge}</span>
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-black heading-display text-white/95 leading-[0.9] tracking-tighter drop-shadow-2xl">
                        {member.name}
                    </h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="inline-block px-5 py-2 bg-black border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
                            <span className="text-red-500 font-black text-[10px] tracking-widest uppercase">{member.role}</span>
                        </div>
                        {member.expertise && (
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.25em]">{member.expertise}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-px w-32 bg-gradient-to-r from-red-600/50 to-transparent"></div>

                <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-all duration-700 max-w-2xl">
                    "{member.bio || member.description}"
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                    <div className="flex gap-3">
                        {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-black border border-white/10 hover:border-red-600/50 hover:bg-slate-900 rounded-xl transition-all group/link shadow-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover/link:opacity-100 transition-opacity"></div>
                                <Github size={20} className="text-slate-400 group-hover/link:text-white transition-colors relative z-10" />
                            </a>
                        )}
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-black border border-white/10 hover:border-red-600/50 hover:bg-slate-900 rounded-xl transition-all group/link shadow-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover/link:opacity-100 transition-opacity"></div>
                                <Linkedin size={20} className="text-slate-400 group-hover/link:text-white transition-colors relative z-10" />
                            </a>
                        )}
                        {member.email && (
                            <a href={`mailto:${member.email}`} className="p-3 bg-slate-900 border border-white/5 hover:border-red-500/50 hover:bg-slate-800 rounded-xl transition-all group/link shadow-lg">
                                <Mail size={20} className="text-slate-500 group-hover/link:text-red-400 transition-colors" />
                            </a>
                        )}
                    </div>

                    <a href={member.focusLink || member.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-red-600 text-white font-bold tracking-widest text-[10px] uppercase hover:bg-red-500 rounded-xl transition-all flex items-center gap-3 ml-auto shadow-xl shadow-red-900/20 active:scale-95">
                        Mentor Focus <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </Motion.div>
    );
};

export default ProfileCard;

