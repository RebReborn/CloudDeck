import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function StellarBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#020617] transition-colors duration-1000">
      {/* Primary Glowing Orbs */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute top-[30%] left-[30%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]"
      />
      
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          scale: 1.2,
        }}
        className="absolute top-[70%] left-[70%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px]"
      />

      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          scale: 0.8,
        }}
        className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[80px]"
      />

      {/* Static Deep Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/50 to-slate-950 opacity-80" />
      
      {/* Grain/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />
    </div>
  );
}
