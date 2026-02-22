import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileCard = ({ member, alternate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative flex flex-col md:flex-row gap-12 items-center glass-panel p-10 mb-32 max-w-6xl mx-auto border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-500 ${alternate ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Cinematic Highlight Line */}
            <div className={`absolute top-0 h-full w-1 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50 ${alternate ? 'right-0' : 'left-0'}`}></div>

            {/* Photo Container with Cyber Frame */}
            <div className="relative flex-shrink-0 w-72 h-96 group/photo">
                <div className="absolute -inset-4 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover/photo:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative w-full h-full overflow-hidden rounded-sm border border-cyan-500/20">
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]"></div>

                    <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover/photo:grayscale-0 transition-all duration-700 scale-105 group-hover/photo:scale-100"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=0891b2&color=fff&size=512` }}
                    />

                    {/* HUD Overlay on Image */}
                    <div className="absolute bottom-4 left-4 z-20 font-mono text-[10px] text-cyan-400/70">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                            <span>BIO_SYNC: 100%</span>
                        </div>
                        <div>UID: SQ139_00{member.id}</div>
                    </div>
                </div>

                {/* Decorative Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>
            </div>

            {/* Content Section */}
            <div className="flex-grow space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-cyan-500 font-mono text-xs font-bold tracking-[0.4em] uppercase">
                        <Terminal size={14} />
                        <span>OPERATIVE_PROFILE</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-white group-hover:text-cyan-50 glow-text transition-colors font-space">
                        {member.name}
                    </h2>
                    <div className="inline-block px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-full">
                        <span className="text-cyan-400 font-bold text-xs tracking-widest uppercase">{member.role}</span>
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>

                <p className="text-gray-300 leading-relaxed text-xl font-light italic opacity-90">
                    "{member.bio}"
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-6">
                    <div className="flex gap-4">
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 rounded-lg transition-all group/link">
                            <Github size={22} className="text-gray-400 group-hover/link:text-cyan-400 transition-colors" />
                        </a>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 rounded-lg transition-all group/link">
                            <Linkedin size={22} className="text-gray-400 group-hover/link:text-cyan-400 transition-colors" />
                        </a>
                        <a href={`mailto:${member.email}`} className="p-3 bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 rounded-lg transition-all group/link">
                            <Mail size={22} className="text-gray-400 group-hover/link:text-cyan-400 transition-colors" />
                        </a>
                    </div>

                    <button className="px-8 py-3 bg-cyan-500 text-black font-black tracking-widest text-xs uppercase hover:bg-white transition-colors flex items-center gap-3 ml-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        ACCESS_FILES <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileCard;
