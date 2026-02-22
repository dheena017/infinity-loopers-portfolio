import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Briefcase, Shield, Zap, ArrowUpRight, Github, ExternalLink, Globe2, Compass } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: "Enterprise Sync",
        desc: "A high-performance data synchronisation platform designed for large-scale enterprise architectures.",
        tags: ["React", "TypeScript", "Redis"],
        icon: Zap,
        color: "blue",
        github: "https://github.com",
        demo: "https://example.com"
    },
    {
        id: 2,
        title: "Global Registry",
        desc: "Managing historical and real-time records through a secure, distributed database system.",
        tags: ["PostgreSQL", "Node.js", "AWS"],
        icon: Globe2,
        color: "indigo",
        github: "https://github.com",
        demo: "https://example.com"
    },
    {
        id: 3,
        title: "Secure Gateway",
        desc: "Advanced security protocols and identity management for cross-border communications.",
        tags: ["OAuth2", "Next.js", "Prisma"],
        icon: Shield,
        color: "slate",
        github: "https://github.com",
        demo: "https://example.com"
    },
    {
        id: 4,
        title: "Platform V3",
        desc: "The latest evolution of our internal dashboard and performance tracking engine.",
        tags: ["GraphQL", "Tailwind", "Framer"],
        icon: Briefcase,
        color: "blue",
        github: "https://github.com",
        demo: "https://example.com"
    }
];

const Expeditions = () => {
    return (
        <section className="section-shell">
            <div className="section-stack md:space-y-28">

                {/* Header Section */}
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-12"
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-widest">
                            <Compass size={14} />
                            Strategic Initiatives 2024
                        </div>
                        <h2 className="section-heading">Global <br /><span className="text-red-500">Expeditions</span></h2>
                    </div>

                    <p className="section-copy max-w-sm border-l border-white/5 pl-8">
                        A dedicated showcase of our most complex and impactful technical breakthroughs in global engineering.
                    </p>
                </Motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {projects.map((project, idx) => (
                        <Motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative panel-card p-8 lg:p-10 flex flex-col gap-8"
                        >
                            <div className="flex justify-between items-start">
                                <div className={`p-4 rounded-xl bg-slate-950 border border-white/5`}>
                                    <project.icon size={28} className="text-red-500" />
                                </div>
                                <div className="flex gap-3">
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-950 rounded-xl border border-white/5 hover:border-red-500/50 transition-colors">
                                        <Github size={18} className="text-slate-500 group-hover:text-white" />
                                    </a>
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-950 rounded-xl border border-white/5 hover:border-red-500/50 transition-colors">
                                        <ExternalLink size={18} className="text-slate-500 group-hover:text-white" />
                                    </a>
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
                        </Motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expeditions;
