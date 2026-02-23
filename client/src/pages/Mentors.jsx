import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { mentorData as localMentors } from '../data/team';
import ProfileCard from '../components/ProfileCard';
import { Briefcase, Star, Users } from 'lucide-react';
import { Users, ChevronRight, Briefcase } from 'lucide-react';

const Mentors = () => {
    const [mentors, setMentors] = useState(localMentors);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch('/api/mentors')
            .then((r) => r.json())
            .then((payload) => {
                if (cancelled) return;
                if (payload && payload.success && Array.isArray(payload.data)) {
                    setMentors(payload.data);
                }
            })
            .catch((err) => {
                console.warn('Mentors fetch failed, using local data:', err);
            })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, []);

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
                            Advisory Leadership
                        </div>
                        <h2 className="section-heading">Board of <br /><span className="text-red-500">Advisors</span></h2>
                        <p className="section-copy max-w-lg">
                            Experienced industry leaders providing strategic direction and technical architectural oversight.
                        </p>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="panel-card p-8 lg:p-10 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4 text-slate-200">
                            <Star size={20} className="text-amber-500" />
                            <span className="font-bold text-lg heading-display">Mentor Network</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Our mentors bring deep domain expertise across systems, security, and product strategy.
                        </p>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span>Trusted Advisors</span>
                            <span>Community Verified</span>
                        </div>
                    </Motion.div>
                </div>

                {/* Mentors List (ProfileCard style) */}
                <div className="grid grid-cols-1 gap-12">
                    {mentors.map((mentor, idx) => (
                        <ProfileCard
                            key={mentor.id}
                            member={{
                                id: mentor.id,
                                name: mentor.name,
                                role: mentor.role || 'Advisor',
                                bio: mentor.desc || '',
                                github: mentor.github || '',
                                linkedin: mentor.linkedin || '',
                                email: mentor.email || '',
                                photo: mentor.photo || '/assets/mentor1.jpg'
                            }}
                            alternate={idx % 2 !== 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mentors;
