import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Cpu, Shield, Zap, Target } from 'lucide-react';

const Landing = ({ onInitiate }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("INITIALIZING_CORE");

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    setStatus("AUTHENTICATION_COMPLETE");
                    return 100;
                }
                const diff = Math.random() * 12;
                const next = Math.min(oldProgress + diff, 100);

                if (next > 20 && next < 50) setStatus("SYNCING_NEURAL_GRID");
                if (next > 50 && next < 80) setStatus("CALIBRATING_SECTORS");
                if (next >= 80) setStatus("SYSTEM_READY");

                return next;
            });
        }, 150);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-[#030305] overflow-hidden"
        >
            {/* Background Grid Accent */}
            <div className="absolute inset-0 grid-bg opacity-30"></div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-12">

                {/* Minimalist Top Meta */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-8 mb-32 opacity-30"
                >
                    <div className="h-[1px] w-12 bg-white"></div>
                    <span className="font-mono-tech !text-[8px] !opacity-100">Project_Voyage_v1</span>
                    <div className="h-[1px] w-12 bg-white"></div>
                </motion.div>

                {/* Main Hero Type */}
                <div className="text-center mb-40">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[12vw] font-black italic leading-none font-space text-white select-none whitespace-nowrap"
                    >
                        SQUAD<span className="text-cyan-500 glow-text">139</span>
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-4"
                    />
                </div>

                {/* Loader Section */}
                <div className="w-full max-w-md flex flex-col gap-10">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] italic">{status}</span>
                            <div className="flex gap-4">
                                <Target size={10} className="text-white/20" />
                                <Activity size={10} className="text-white/20" />
                            </div>
                        </div>
                        <span className="text-3xl font-light italic font-space text-white/40">{Math.floor(progress)}%</span>
                    </div>

                    <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                        />
                    </div>
                </div>

                {/* Enter Button */}
                <div className="h-32 flex items-center mt-20">
                    <AnimatePresence>
                        {progress === 100 && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onInitiate}
                                className="group flex items-center gap-10 px-16 py-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 bg-white/5 backdrop-blur-xl"
                            >
                                <span className="font-mono-tech !text-[10px] !opacity-100 text-white tracking-[0.6em]">Initiate_Sequence</span>
                                <div className="p-2 rounded-full border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all">
                                    <ArrowRight size={16} className="text-white group-hover:text-black transition-colors" />
                                </div>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Landing;

