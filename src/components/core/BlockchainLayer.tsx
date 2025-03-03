'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface Block {
  id: string;
  transactions: Transaction[];
  timestamp: number;
  hash: string;
  previousHash: string;
}

interface BlockchainLayerProps {
  width?: number;
  height?: number;
  blocks?: Block[];
  onBlockClick?: (block: Block) => void;
}

const BlockchainLayer: React.FC<BlockchainLayerProps> = ({
  width = 1000,
  height = 400,
  blocks = [],
  onBlockClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredBlock, setHoveredBlock] = useState<Block | null>(null);
  const animationsRef = useRef<gsap.core.Timeline[]>([]);

  // Initialize canvas and start animation loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up high DPI canvas
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    // Calculate block positions
    const blockWidth = 150;
    const blockHeight = 80;
    const blockSpacing = 50;
    const startX = 50;
    const centerY = height / 2;

    // Clear previous animations
    animationsRef.current.forEach(tl => tl.kill());
    animationsRef.current = [];

    // Draw and animate blocks
    blocks.forEach((block, index) => {
      const x = startX + index * (blockWidth + blockSpacing);
      const y = centerY - blockHeight / 2;

      // Create block animation
      const timeline = gsap.timeline({ repeat: -1 });
      timeline.to({}, {
        duration: 2,
        onUpdate: () => {
          // Draw block
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = hoveredBlock?.id === block.id ? '#4a90e2' : '#2d3748';
          ctx.strokeStyle = '#718096';
          ctx.lineWidth = 2;
          ctx.roundRect(x, y, blockWidth, blockHeight, 8);
          ctx.fill();
          ctx.stroke();

          // Draw block hash
          ctx.fillStyle = '#fff';
          ctx.font = '12px monospace';
          ctx.fillText(`#${block.hash.slice(0, 8)}...`, x + 10, y + 25);

          // Draw transaction count
          ctx.fillText(
            `${block.transactions.length} txs`,
            x + 10,
            y + 45
          );

          // Draw connection line to previous block
          if (index > 0) {
            ctx.beginPath();
            ctx.strokeStyle = '#718096';
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, centerY);
            ctx.lineTo(x - blockSpacing, centerY);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.restore();
        }
      });

      animationsRef.current.push(timeline);
    });

    // Handle mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * pixelRatio;
      const y = (e.clientY - rect.top) * pixelRatio;

      // Check if mouse is over any block
      const hoveredBlock = blocks.find((block, index) => {
        const blockX = startX + index * (blockWidth + blockSpacing);
        const blockY = centerY - blockHeight / 2;
        return (
          x >= blockX &&
          x <= blockX + blockWidth &&
          y >= blockY &&
          y <= blockY + blockHeight
        );
      });

      setHoveredBlock(hoveredBlock || null);
    };

    const handleClick = (e: MouseEvent) => {
      if (hoveredBlock && onBlockClick) {
        onBlockClick(hoveredBlock);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      animationsRef.current.forEach(tl => tl.kill());
    };
  }, [width, height, blocks, hoveredBlock, onBlockClick]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="border border-gray-200 rounded-lg shadow-lg"
      />
      {hoveredBlock && (
        <div
          className="absolute bg-gray-800 text-white p-4 rounded-lg shadow-xl"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '20px',
            zIndex: 10,
          }}
        >
          <h3 className="font-bold mb-2">Block Details</h3>
          <p>Hash: {hoveredBlock.hash}</p>
          <p>Transactions: {hoveredBlock.transactions.length}</p>
          <p>Time: {new Date(hoveredBlock.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default BlockchainLayer; 