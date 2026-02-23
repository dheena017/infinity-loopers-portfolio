import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  const [loadingText, setLoadingText] = useState('INITIALIZING SYSTEMS');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const messages = [
      'INITIALIZING SYSTEMS',
      'CONNECTING TO MISSION CONTROL',
      'LOADING OPERATIVE DATA',
      'PREPARING LAUNCH SEQUENCE',
      'SYSTEMS READY'
    ];
    
    let index = 0;
    const messageInterval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 1500);

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center z-[200] overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridPulse 3s ease-in-out infinite'
          }}
        />
      </div>

      {/* Scanning Lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ y: '-100%' }}
        animate={{ y: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="h-32 bg-gradient-to-b from-transparent via-[#ef4444]/10 to-transparent blur-sm" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] via-[#f87171] to-[#f59e0b]">
              SQUAD
            </span>
          </div>
          <div className="text-sm md:text-base text-slate-400 uppercase tracking-[0.3em] font-medium">
            Portfolio System v3.0
          </div>
        </motion.div>

        {/* Hexagon Spinner */}
        <div className="relative w-32 h-32">
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-[#ef4444]/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#ef4444] rounded-full shadow-[0_0_10px_#ef4444]" />
          </motion.div>

          {/* Middle Ring */}
          <motion.div
            className="absolute inset-4 border-2 border-[#f87171]/40"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* Inner Core */}
          <motion.div
            className="absolute inset-8 bg-gradient-to-br from-[#ef4444] to-[#f59e0b] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-sm md:text-base font-medium text-[#ef4444] uppercase tracking-widest">
            {loadingText}<span className="inline-block w-8 text-left">{dots}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ef4444] to-[#f59e0b]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>
        </motion.div>

        {/* Status Indicators */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#ef4444]/30 rounded-full"
              animate={{
                backgroundColor: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 0.3)']
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#ef4444]/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#ef4444]/30" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[#ef4444]/30" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#ef4444]/30" />

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default Loading;
