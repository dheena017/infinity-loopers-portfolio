import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield, Zap, Target, ArrowUpRight, Github, ExternalLink, Globe } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: "NEURAL_SYNC_BETA",
        desc: "A decentralized learning platform bridging gaps in neural-link data streams.",
        tags: ["Logic", "Three.js", "Motion"],
        icon: Zap,
        color: "cyan"
    },
    {
        id: 2,
        title: "ORBIT_ARCHIVE",
        desc: "Preserving historical cosmic events through a persistent spatial database.",
        tags: ["Supabase", "React", "Spatial"],
        icon: Globe,
        color: "purple"
    },
    {
        id: 3,
        title: "CORE_SEC_DELTA",
        desc: "Advanced security protocols for inter-planetary communications.",
        tags: ["Auth", "Security", "Rust"],
        icon: Shield,
        color: "blue"
    },
    {
        id: 4,
        title: "VOYAGER_EXT_139",
        desc: "The flagship expedition vessel's navigational interface system.",
        tags: ["HUD", "GSAP", "Physics"],
        icon: Rocket,
        color: "indigo"
    }
];

const Expeditions = () => {
    return (
        <section className="py-64 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-10"></div>

            <div className="container-premium relative z-10 w-full">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col mb-48 border-l-2 border-purple-500/30 pl-12"
                >
                    <div className="flex items-center gap-6 mb-8 text-purple-400">
                        <Rocket size={12} className="animate-bounce" />
                        <span className="font-mono-tech !text-[9px]">Mission_Log: Class_Expeditions</span>
                    </div>

                    <h2 className="text-9xl font-black tracking-tighter italic uppercase leading-none text-white font-space">
                        CLASS<br />
                        <span className="text-purple-500 glow-text">EXPEDITIONS</span>
                    </h2>

                    <p className="mt-12 text-xl text-gray-500 italic max-w-xl leading-relaxed">
                        A curated showcase of exploratory projects built at the frontier of digital engineering.
                    </p>
                </motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative glass-panel p-16 flex flex-col gap-10 hover:border-purple-500/30 transition-all duration-700"
                        >
                            <div className="flex justify-between items-start">
                                <div className={`p-4 rounded-sm bg-black/40 border border-${project.color}-500/20`}>
                                    <project.icon size={24} className={`text-${project.color}-400`} />
                                </div>
                                <div className="flex gap-4">
                                    <Github size={18} className="text-white/10 hover:text-white transition-colors cursor-pointer" />
                                    <ExternalLink size={18} className="text-white/10 hover:text-white transition-colors cursor-pointer" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase font-space group-hover:text-purple-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 font-light italic leading-relaxed">
                                    {project.desc}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-auto pt-8 border-t border-white/5">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="text-purple-500/40" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expeditions;
