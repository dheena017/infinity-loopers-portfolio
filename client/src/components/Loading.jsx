import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';

const STAR_FIELD = Array.from({ length: 100 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  width: `${Math.random() * 2}px`,
  height: `${Math.random() * 2}px`,
  opacity: Math.random() * 0.5 + 0.2,
  animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
  animationDelay: `${Math.random() * 2}s`
}));

const METEORS = Array.from({ length: 5 }, (_, i) => ({
  left: `${20 + Math.random() * 60}%`,
  delay: i * 1.5,
  duration: 3 + Math.random() * 2
}));

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030305] flex items-center justify-center z-[200] overflow-hidden">
      {/* Subtle Star Field */}
      <div className="absolute inset-0">
        {STAR_FIELD.map((star, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={star}
          />
        ))}
      </div>

      {/* Professional Meteor Effect - Fewer, Smoother */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {METEORS.map((meteor, i) => (
          <Motion.div
            key={`meteor-${i}`}
            className="absolute w-px h-24 bg-gradient-to-b from-transparent via-white to-transparent"
            style={{
              left: meteor.left,
              top: '-10%',
              opacity: 0.6,
              filter: 'blur(0.5px)'
            }}
            animate={{
              x: [-100, -250],
              y: [0, '120vh'],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: meteor.duration,
              repeat: Infinity,
              delay: meteor.delay,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#030305]/50 to-[#030305]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-4 max-w-md">
        {/* Logo */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3"
        >
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400">
              SQUAD
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-red-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Portfolio System
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-red-600" />
          </div>
        </Motion.div>

        {/* Loading Spinner */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-32 h-32"
        >
          {/* Outer Ring */}
          <Motion.div
            className="absolute inset-0 rounded-full border border-slate-800/50"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          </Motion.div>

          {/* Middle Ring */}
          <Motion.div
            className="absolute inset-4 rounded-full border border-slate-700/30"
            animate={{ rotate: -360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* Inner Glow */}
          <Motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-red-600/20 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </Motion.div>

        {/* Progress Bar */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-3"
        >
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden shadow-inner">
            <Motion.div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-full relative overflow-hidden"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            >
              <Motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </Motion.div>
          </div>
          
          {/* Loading Text */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 uppercase tracking-wider font-medium">
              Loading Resources
            </span>
            <span className="text-slate-500 font-mono">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </Motion.div>

        {/* Status Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <Motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-700"
              animate={{
                backgroundColor: ['#334155', '#dc2626', '#334155'],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;

