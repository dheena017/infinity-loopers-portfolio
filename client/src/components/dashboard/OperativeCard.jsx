import React from 'react';
import { motion } from 'framer-motion';
import { User, Github, Linkedin, ArrowRight } from 'lucide-react';

const OperativeCard = ({ operative }) => {
    // Fallback data if certain fields are missing from the API response
    const {
        name = "Unknown Operative",
        role = "Specialist",
        description = "Full-stack wizard who enjoys the challenge of working across the entire tech stack.",
        skills = ["NODE.JS", "FIGMA", "TYPESCRIPT"],
        avatar_url,
        github_url,
        linkedin_url
    } = operative;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="w-full h-full p-6 bg-[#0B1221] rounded-[32px] border border-white/5 flex flex-col items-center text-center shadow-xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-white/10"
        >
            {/* Background Texture/Grid Effect (Optional) */}
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-5 pointer-events-none"></div>

            {/* Avatar Section */}
            <div className="w-48 h-48 bg-slate-700/50 rounded-full mb-6 overflow-hidden relative border-4 border-[#161B28] shadow-inner">
                {avatar_url ? (
                    <img src={avatar_url} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-600">
                        <User size={84} className="text-zinc-400 opacity-50" />
                    </div>
                )}
            </div>

            {/* Header: Name & Role */}
            <div className="w-full flex items-center justify-between mb-4 px-2">
                <h3 className="text-white text-2xl font-black tracking-tight text-left">{name}</h3>
                <span className="px-3 py-1 rounded-full bg-[#0F3036] text-[#2DD4BF] text-[10px] font-bold uppercase tracking-wider border border-[#18484E] shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                    {role}
                </span>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed mb-6 px-2 text-left line-clamp-3 w-full">
                {description}
            </p>

            {/* Tech Stack / Skills */}
            <div className="flex gap-2 mb-8 w-full justify-start flex-wrap px-2">
                {(skills || []).slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-[#161B28] rounded-xl border border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        {skill}
                    </span>
                ))}
                {(skills || []).length > 3 && (
                    <span className="px-3 py-1.5 bg-[#161B28] rounded-xl border border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        +{(skills || []).length - 3}
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center gap-3 mt-auto px-2">
                <button className="flex-1 bg-white text-black font-bold py-3 rounded-full flex items-center justify-center gap-2 text-xs tracking-wider hover:bg-slate-200 transition-colors shadow-lg shadow-white/10 group-hover:scale-[1.02] active:scale-95 duration-200">
                    VIEW SYSTEM <ArrowRight size={14} />
                </button>
                
                <a 
                    href={github_url || "#"} 
                    className="w-12 h-12 rounded-2xl bg-[#161B28] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all hover:bg-slate-800"
                >
                    <Github size={20} />
                </a>
                
                <a 
                    href={linkedin_url || "#"} 
                    className="w-12 h-12 rounded-2xl bg-[#161B28] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all hover:bg-slate-800"
                >
                    <Linkedin size={20} />
                </a>
            </div>
        </motion.div>
    );
};

export default OperativeCard;
