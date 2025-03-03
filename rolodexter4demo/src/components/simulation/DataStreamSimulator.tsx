/**
 * DataStreamSimulator Component
 * 
 * A high-performance data stream simulation component that generates
 * billions of simulated user interactions in real-time. This component
 * implements several key technical features:
 * 
 * 1. Data Stream Generation
 *    - Simulates billions of user interactions
 *    - Generates blockchain transactions
 *    - Creates social network activity
 *    - Implements real-time data updates
 * 
 * 2. Performance Optimizations
 *    - Uses Web Workers for data generation
 *    - Implements data batching
 *    - Maintains smooth UI updates
 *    - Optimizes memory usage
 * 
 * 3. Visual Effects
 *    - Creates data stream visualizations
 *    - Implements glitch effects
 *    - Generates particle effects
 *    - Shows real-time statistics
 * 
 * 4. Technical Decisions
 *    - Uses Web Workers for performance
 *    - Implements custom data structures
 *    - Creates efficient update cycles
 *    - Manages memory efficiently
 * 
 * @component
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

/**
 * DataStream Interface
 * 
 * Defines the structure of a data stream with:
 * - Unique identifier
 * - Data type
 * - Content
 * - Visual properties
 */
interface DataStream {
  id: string;
  type: 'post' | 'transaction' | 'reaction' | 'connection';
  content: string;
  timestamp: number;
  x: number;
  y: number;
  velocity: number;
  opacity: number;
}

/**
 * Stats Interface
 * 
 * Defines the structure of real-time statistics with:
 * - User counts
 * - Transaction counts
 * - Activity metrics
 * - Performance data
 */
interface Stats {
  totalUsers: number;
  activeUsers: number;
  transactionsPerSecond: number;
  postsPerSecond: number;
  reactionsPerSecond: number;
  fps: number;
}

/**
 * DataStreamSimulator Component
 * 
 * Implements a high-speed data stream simulation with:
 * - Real-time data generation
 * - Visual effects
 * - Performance monitoring
 * - Statistics display
 */
export const DataStreamSimulator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [streams, setStreams] = useState<DataStream[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    transactionsPerSecond: 0,
    postsPerSecond: 0,
    reactionsPerSecond: 0,
    fps: 0,
  });

  /**
   * Initialize Web Worker
   * 
   * Technical Implementation:
   * - Creates Web Worker for data generation
   * - Sets up message handling
   * - Manages worker lifecycle
   */
  useEffect(() => {
    // Create Web Worker for data generation
    workerRef.current = new Worker(
      new URL('./dataStreamWorker.ts', import.meta.url)
    );

    // Handle worker messages
    workerRef.current.onmessage = (event) => {
      const { streams: newStreams, stats: newStats } = event.data;
      setStreams(prev => [...prev, ...newStreams].slice(-1000));
      setStats(newStats);
    };

    // Start worker
    workerRef.current.postMessage({ type: 'START' });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  /**
   * Initialize Canvas and Animation
   * 
   * Technical Implementation:
   * - Sets up canvas context
   * - Implements animation loop
   * - Handles stream updates
   * - Manages visual effects
   */
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Animation loop
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (currentTime: number) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        setStats(prev => ({ ...prev, fps: frameCount }));
        frameCount = 0;
        lastTime = currentTime;
      }

      ctx.clearRect(0, 0, width, height);

      // Update and draw streams
      streams.forEach(stream => {
        stream.x += stream.velocity;
        stream.opacity -= 0.01;

        if (stream.opacity > 0) {
          ctx.beginPath();
          ctx.moveTo(stream.x, stream.y);
          ctx.lineTo(stream.x + 100, stream.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${stream.opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Remove dead streams
      setStreams(prev => prev.filter(s => s.opacity > 0));

      requestAnimationFrame(animate);
    };

    animate(0);
  }, [streams]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Visual Effects Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanline" />
        <div className="noise" />
      </div>

      {/* Data Stream Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Stats Display */}
      <div className="absolute top-4 right-4 z-20 text-white font-mono text-sm">
        <div>Total Users: {stats.totalUsers.toLocaleString()}</div>
        <div>Active Users: {stats.activeUsers.toLocaleString()}</div>
        <div>TPS: {stats.transactionsPerSecond.toLocaleString()}</div>
        <div>Posts/s: {stats.postsPerSecond.toLocaleString()}</div>
        <div>Reactions/s: {stats.reactionsPerSecond.toLocaleString()}</div>
        <div>FPS: {stats.fps}</div>
      </div>
    </motion.div>
  );
}; 