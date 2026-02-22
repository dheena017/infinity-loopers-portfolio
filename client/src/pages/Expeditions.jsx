import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Shield, Zap, Target, ArrowUpRight, Github, ExternalLink, Globe2, Compass } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: "Enterprise Sync",
        desc: "A high-performance data synchronisation platform designed for large-scale enterprise architectures.",
        tags: ["React", "TypeScript", "Redis"],
        icon: Zap,
        color: "blue"
    },
    {
        id: 2,
        title: "Global Registry",
        desc: "Managing historical and real-time records through a secure, distributed database system.",
        tags: ["PostgreSQL", "Node.js", "AWS"],
        icon: Globe2,
        color: "indigo"
    },
    {
        id: 3,
        title: "Secure Gateway",
        desc: "Advanced security protocols and identity management for cross-border communications.",
        tags: ["OAuth2", "Next.js", "Prisma"],
        icon: Shield,
        color: "slate"
    },
    {
        id: 4,
        title: "Platform V3",
        desc: "The latest evolution of our internal dashboard and performance tracking engine.",
        tags: ["GraphQL", "Tailwind", "Framer"],
        icon: Briefcase,
        color: "blue"
    }
];

const Expeditions = () => {
    return (
        <section className="py-24 min-h-screen">
            <div className="container-premium space-y-32">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-12"
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-widest">
                            <Compass size={14} />
                            Strategic Initiatives 2024
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black heading-display break-words">Global <br /><span className="text-red-500">Expeditions</span></h2>
                    </div>

                    <p className="text-lg text-slate-400 max-w-sm leading-relaxed border-l border-white/5 pl-8">
                        A dedicated showcase of our most complex and impactful technical breakthroughs in global engineering.
                    </p>
                </motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative premium-card p-12 flex flex-col gap-10 bg-slate-900/40"
                        >
                            <div className="flex justify-between items-start">
                                <div className={`p-4 rounded-xl bg-slate-950 border border-white/5`}>
                                    <project.icon size={28} className="text-red-500" />
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-3 bg-slate-950 rounded-xl border border-white/5 hover:border-red-500/50 transition-colors">
                                        <Github size={18} className="text-slate-500 group-hover:text-white" />
                                    </button>
                                    <button className="p-3 bg-slate-950 rounded-xl border border-white/5 hover:border-red-500/50 transition-colors">
                                        <ExternalLink size={18} className="text-slate-500 group-hover:text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-4xl font-black heading-display text-white group-hover:text-red-500 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-slate-400 font-medium leading-relaxed max-w-md">
                                    {project.desc}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto pt-8 border-t border-white/5">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-slate-800 border border-white/5 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:border-red-500/20 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1">
                                <ArrowUpRight size={24} className="text-red-500/40" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expeditions;
