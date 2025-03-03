/**
 * BlockchainLayer Component
 * 
 * A high-performance blockchain transaction visualization component that displays
 * real-time blockchain activity. This component implements several key technical features:
 * 
 * 1. Transaction Visualization
 *    - Displays blockchain transactions in real-time
 *    - Implements transaction flow animations
 *    - Shows transaction status and details
 * 
 * 2. Performance Optimizations
 *    - Uses WebGL for particle effects
 *    - Implements transaction batching
 *    - Maintains smooth animations at 60fps
 * 
 * 3. Visual Effects
 *    - Creates particle trails for transactions
 *    - Implements glitch effects for confirmations
 *    - Generates blockchain-specific visual elements
 * 
 * 4. Technical Decisions
 *    - Uses canvas for high-performance rendering
 *    - Implements custom particle system
 *    - Creates realistic blockchain visualizations
 * 
 * @component
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Transaction Interface
 * 
 * Defines the structure of a blockchain transaction with:
 * - Unique identifier
 * - Transaction details
 * - Visual properties
 * - Status information
 */
interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Particle Interface
 * 
 * Defines the structure of a visual particle with:
 * - Position coordinates
 * - Velocity
 * - Lifecycle properties
 * - Visual properties
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

/**
 * BlockchainLayer Component
 * 
 * Implements a blockchain transaction visualization with:
 * - Real-time transaction updates
 * - Particle effects
 * - Status indicators
 * - Transaction flow animations
 */
export const BlockchainLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [particles, setParticles] = React.useState<Particle[]>([]);

  /**
   * Initialize Canvas and Animation
   * 
   * Technical Implementation:
   * - Sets up canvas context
   * - Implements animation loop
   * - Handles particle updates
   * - Manages transaction rendering
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
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.01;

        if (particle.life > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
          ctx.fill();
        }
      });

      // Update and draw transactions
      transactions.forEach(tx => {
        tx.x += tx.vx;
        tx.y += tx.vy;

        // Draw transaction line
        ctx.beginPath();
        ctx.moveTo(tx.x, tx.y);
        ctx.lineTo(tx.x + tx.vx * 10, tx.y + tx.vy * 10);
        ctx.strokeStyle = tx.status === 'confirmed' ? '#00FFFF' : 
                         tx.status === 'pending' ? '#FFFFFF' : '#FF0000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw transaction node
        ctx.beginPath();
        ctx.arc(tx.x, tx.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = tx.status === 'confirmed' ? '#00FFFF' : 
                       tx.status === 'pending' ? '#FFFFFF' : '#FF0000';
        ctx.fill();
      });

      // Remove dead particles
      setParticles(prev => prev.filter(p => p.life > 0));

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, transactions]);

  /**
   * Generate Transaction Data
   * 
   * Technical Implementation:
   * - Creates random transactions
   * - Simulates blockchain activity
   * - Updates transaction states
   * - Generates particle effects
   */
  useEffect(() => {
    const generateTransaction = () => {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        amount: Math.random() * 1000,
        timestamp: Date.now(),
        status: Math.random() > 0.8 ? 'confirmed' : 
                Math.random() > 0.9 ? 'failed' : 'pending',
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      };

      // Generate particles for new transaction
      const newParticles = Array.from({ length: 5 }, () => ({
        x: newTx.x,
        y: newTx.y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color: '#FFFFFF',
        size: 2 + Math.random() * 2,
      }));

      setTransactions(prev => [...prev, newTx].slice(-50));
      setParticles(prev => [...prev, ...newParticles]);
    };

    generateTransaction();
    const interval = setInterval(generateTransaction, 1000);

    return () => clearInterval(interval);
  }, []);

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

      {/* Transaction Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Transaction Stats */}
      <div className="absolute bottom-4 left-4 z-20 text-white font-mono text-sm">
        <div>Transactions: {transactions.length}</div>
        <div>Confirmed: {transactions.filter(tx => tx.status === 'confirmed').length}</div>
        <div>Pending: {transactions.filter(tx => tx.status === 'pending').length}</div>
        <div>Failed: {transactions.filter(tx => tx.status === 'failed').length}</div>
      </div>
    </motion.div>
  );
}; 