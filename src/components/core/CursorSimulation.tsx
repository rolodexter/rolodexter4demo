'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface Cursor {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface CursorSimulationProps {
  width?: number;
  height?: number;
  cursorCount?: number;
}

const CursorSimulation: React.FC<CursorSimulationProps> = ({
  width = 800,
  height = 600,
  cursorCount = 3
}) => {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationControls = useRef<{ [key: string]: any }>({});
  const connectionsRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize animation controls at the top level
  const cursorAnimations = useRef(
    Array(cursorCount)
      .fill(null)
      .map(() => useAnimation())
  );

  // Generate cursor data
  useEffect(() => {
    const newCursors = Array.from({ length: cursorCount }, (_, i) => ({
      id: `cursor-${i}`,
      x: Math.random() * width,
      y: Math.random() * height,
      scale: Math.random() * 0.5 + 0.75,
      rotation: Math.random() * 360
    }));

    setCursors(newCursors);
    newCursors.forEach((cursor, index) => {
      animationControls.current[cursor.id] = cursorAnimations.current[index];
    });
  }, [cursorCount, width, height]);

  // Draw neural connections
  useEffect(() => {
    const drawConnections = () => {
      if (!connectionsRef.current) return;
      const ctx = connectionsRef.current.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.1)';
      ctx.lineWidth = 1;

      cursors.forEach((cursor1, i) => {
        cursors.slice(i + 1).forEach(cursor2 => {
          const distance = Math.hypot(cursor2.x - cursor1.x, cursor2.y - cursor1.y);
          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(cursor1.x, cursor1.y);
            ctx.lineTo(cursor2.x, cursor2.y);
            ctx.stroke();
          }
        });
      });
    };

    const interval = setInterval(drawConnections, 50);
    return () => clearInterval(interval);
  }, [cursors, width, height]);

  // Animate cursors
  useEffect(() => {
    const animateCursor = async (cursor: Cursor) => {
      while (true) {
        const newX = Math.random() * (width - 20);
        const newY = Math.random() * (height - 20);
        const newScale = Math.random() * 0.5 + 0.75;
        const newRotation = Math.random() * 360;
        const duration = Math.random() * 3 + 2;

        await animationControls.current[cursor.id].start({
          x: newX,
          y: newY,
          scale: newScale,
          rotate: newRotation,
          transition: {
            duration,
            ease: [0.4, 0, 0.2, 1]
          }
        });

        await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
      }
    };

    cursors.forEach(animateCursor);
  }, [cursors, width, height]);

  return (
    <div
      ref={containerRef}
      className="relative bg-white rounded-none overflow-hidden circuit-background"
      style={{ width, height }}
    >
      {/* Circuit grid overlay */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8">
        {Array.from({ length: 96 }).map((_, i) => (
          <div
            key={i}
            className="border-[0.5px] border-foreground/5"
          />
        ))}
      </div>

      {/* Neural connections canvas */}
      <canvas
        ref={connectionsRef}
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none"
      />

      {/* System coordinates */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-foreground/40 hologram-text">
        <div>SYSTEM.COORDINATES</div>
        {cursors.map(cursor => (
          <div key={cursor.id} className="flex space-x-2">
            <span>NODE_{cursor.id}:</span>
            <span>X:{Math.floor(cursor.x)}</span>
            <span>Y:{Math.floor(cursor.y)}</span>
          </div>
        ))}
      </div>

      {/* Scanning cursors */}
      <AnimatePresence>
        {cursors.map(cursor => (
          <motion.div
            key={cursor.id}
            animate={animationControls.current[cursor.id]}
            initial={{ x: cursor.x, y: cursor.y, scale: cursor.scale, rotate: cursor.rotation }}
            className="absolute pointer-events-none"
            style={{ zIndex: 1000 }}
          >
            {/* Scanner design */}
            <div className="relative">
              <div className="absolute -translate-x-1/2 -translate-y-1/2">
                {/* Outer ring */}
                <div className="w-12 h-12 rounded-full border border-accent/20 animate-[scanner-rotate_4s_linear_infinite]" />
                {/* Middle ring */}
                <div className="absolute inset-0 w-8 h-8 m-auto rounded-full border border-accent/30" />
                {/* Inner ring */}
                <div className="absolute inset-0 w-4 h-4 m-auto rounded-full border border-accent/40" />
                {/* Center dot */}
                <div className="absolute inset-0 w-1 h-1 m-auto rounded-full bg-accent neural-glow" />
                {/* Scanning effect */}
                <div className="absolute inset-0 hologram-scanner rounded-full" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Status indicator */}
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-foreground/40 flex items-center space-x-2">
        <div className="w-1 h-1 rounded-full bg-accent neural-pulse" />
        <span className="hologram-text">NETWORK.SCAN_ACTIVE</span>
      </div>
    </div>
  );
};

export default CursorSimulation; 