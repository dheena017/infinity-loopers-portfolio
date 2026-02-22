import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Smooth springs for high-end feel
    const cursorX = useSpring(0, { damping: 20, stiffness: 250 });
    const cursorY = useSpring(0, { damping: 20, stiffness: 250 });

    const ringX = useSpring(0, { damping: 30, stiffness: 150 });
    const ringY = useSpring(0, { damping: 30, stiffness: 150 });

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 4);
            cursorY.set(e.clientY - 4);
            ringX.set(e.clientX - 16);
            ringY.set(e.clientY - 16);
            if (!isVisible) setIsVisible(true);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Core Dot */}
            <motion.div
                style={{ x: cursorX, y: cursorY }}
                className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,1)]"
            />

            {/* Outer Ring */}
            <motion.div
                style={{ x: ringX, y: ringY }}
                className="w-8 h-8 border border-cyan-400/30 rounded-full"
            />

            {/* Crosshair lines */}
            <motion.div
                style={{ x: ringX, y: ringY }}
                className="absolute w-8 h-8"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-cyan-400/50"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-cyan-400/50"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-cyan-400/50"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-cyan-400/50"></div>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
