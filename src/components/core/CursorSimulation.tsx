'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Cursor {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

interface CursorSimulationProps {
  width?: number;
  height?: number;
  cursorCount?: number;
}

const CursorSimulation: React.FC<CursorSimulationProps> = ({
  width = 800,
  height = 600,
  cursorCount = 5
}) => {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationControls = useRef<{ [key: string]: any }>({});

  // Generate random cursor data
  useEffect(() => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1',
      '#96CEB4', '#FFEEAD', '#D4A5A5'
    ];
    const names = [
      'Alice', 'Bob', 'Charlie',
      'Diana', 'Eve', 'Frank'
    ];

    const newCursors = Array.from({ length: cursorCount }, (_, i) => ({
      id: `cursor-${i}`,
      x: Math.random() * width,
      y: Math.random() * height,
      color: colors[i % colors.length],
      name: names[i % names.length]
    }));

    setCursors(newCursors);
    newCursors.forEach(cursor => {
      animationControls.current[cursor.id] = useAnimation();
    });
  }, [cursorCount, width, height]);

  // Animate cursors
  useEffect(() => {
    const animateCursor = async (cursor: Cursor) => {
      while (true) {
        const newX = Math.random() * (width - 50);
        const newY = Math.random() * (height - 50);
        const duration = Math.random() * 2 + 1;

        await animationControls.current[cursor.id].start({
          x: newX,
          y: newY,
          transition: {
            duration,
            ease: 'easeInOut'
          }
        });

        // Add random pause between movements
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
      }
    };

    cursors.forEach(animateCursor);
  }, [cursors, width, height]);

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-50 rounded-lg shadow-inner overflow-hidden"
      style={{ width, height }}
    >
      {cursors.map(cursor => (
        <motion.div
          key={cursor.id}
          animate={animationControls.current[cursor.id]}
          initial={{ x: cursor.x, y: cursor.y }}
          className="absolute pointer-events-none"
          style={{ zIndex: 1000 }}
        >
          {/* Cursor icon */}
          <div className="relative">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={cursor.color}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            >
              <path d="M5.5,2.5l15,15H13l-3,4.5L7,13H0L5.5,2.5z" />
            </svg>
            
            {/* Name tag */}
            <div
              className="absolute left-6 top-0 px-2 py-1 rounded-full text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Grid overlay for visual reference */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-4">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default CursorSimulation; 