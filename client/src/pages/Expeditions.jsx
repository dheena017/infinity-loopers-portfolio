import React from 'react';
import { motion as Motion, useScroll, useTransform } from 'framer-motion';
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
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const y = useTransform(scrollY, [0, 400], [0, -30]);

    return (
        <section className="section-shell">
            <div className="section-stack md:space-y-28">

                {/* Header Section */}
                <Motion.div
                    style={{ opacity, y }}
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
                            className="group relative flex flex-col aspect-[2/1] min-h-[200px] w-full"
                        >
                            {/* Visual Layer - Premium Glass Box */}
                            <div className="absolute inset-0 panel-card transition-all duration-500 group-hover:border-red-500/30 group-hover:shadow-[0_0_50px_rgba(239,68,68,0.15)] z-0"></div>

                            {/* Content Layer (Structured Box Layout) */}
                            <div className="relative z-10 p-[16px] flex flex-col h-full w-full">
                                {/* Inner Content Wrapper (Physical Offset) */}
                                <div className="ml-[18px] flex flex-col items-start text-left h-full w-full">
                                    {/* 1. Header Row */}
                                    <div className="w-full flex justify-between items-start mb-6">
                                        <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 shadow-inner">
                                            <project.icon size={28} className="text-red-500" />
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-950/50 rounded-xl border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300">
                                                <Github size={18} className="text-slate-500 group-hover:text-white" />
                                            </a>
                                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-950/50 rounded-xl border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300">
                                                <ExternalLink size={18} className="text-slate-500 group-hover:text-white" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* 2. Main Body (Expands to fill space) */}
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black heading-display text-white group-hover:text-red-500 transition-colors leading-[1.2]">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-400 font-medium leading-relaxed max-w-sm text-sm sm:text-base opacity-80">
                                            {project.desc}
                                        </p>
                                    </div>

                                    {/* 3. Footer Tags (Pinned to safe area bottom) */}
                                    <div className="w-full mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-4 py-1.5 bg-slate-900/80 border border-white/5 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:border-red-500/20 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Hover Locator */}
                                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                                    <ArrowUpRight size={24} className="text-red-500/40" />
                                </div>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expeditions;
