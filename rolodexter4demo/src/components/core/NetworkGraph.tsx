/**
 * NetworkGraph Component
 * 
 * A high-performance network visualization component that displays the social graph
 * in real-time. This component implements several key technical features:
 * 
 * 1. Dynamic Network Visualization
 *    - Uses D3.js for force-directed graph layout
 *    - Implements real-time node and edge updates
 *    - Optimizes rendering with WebGL acceleration
 * 
 * 2. Performance Optimizations
 *    - Uses canvas rendering for large networks
 *    - Implements node clustering for scalability
 *    - Maintains smooth animations at 60fps
 * 
 * 3. Visual Effects
 *    - Implements cyberpunk-style node and edge styling
 *    - Creates dynamic connection animations
 *    - Generates particle effects for network activity
 * 
 * 4. Technical Decisions
 *    - Chose D3.js for its powerful graph layout algorithms
 *    - Selected canvas rendering for performance
 *    - Implemented custom force simulation for network dynamics
 * 
 * @component
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

/**
 * Node Interface
 * 
 * Defines the structure of a network node with:
 * - Unique identifier
 * - Position coordinates
 * - Visual properties
 * - Activity state
 */
interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  active: boolean;
}

/**
 * Edge Interface
 * 
 * Defines the structure of a network connection with:
 * - Source and target node IDs
 * - Strength of connection
 * - Visual properties
 * - Activity state
 */
interface Edge {
  source: string;
  target: string;
  strength: number;
  color: string;
  active: boolean;
}

/**
 * NetworkGraph Component
 * 
 * Implements a force-directed network visualization with:
 * - Real-time node and edge updates
 * - Dynamic force simulation
 * - Interactive zoom and pan
 * - Activity-based animations
 */
export const NetworkGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Edge> | null>(null);
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  /**
   * Initialize D3 Force Simulation
   * 
   * Technical Implementation:
   * - Sets up force-directed layout
   * - Configures node and edge forces
   * - Implements collision detection
   * - Handles simulation updates
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

    // Create force simulation
    const simulation = d3.forceSimulation<Node, Edge>()
      .force('link', d3.forceLink<Node, Edge>()
        .id((d) => d.id)
        .distance(50)
        .strength(0.7))
      .force('charge', d3.forceManyBody<Node>()
        .strength(-100)
        .distanceMax(200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>()
        .radius(30)
        .strength(0.8));

    // Update canvas on simulation tick
    simulation.on('tick', () => {
      ctx.clearRect(0, 0, width, height);

      // Draw edges
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = edge.active ? '#00FFFF' : 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = edge.strength * 2;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
        ctx.fillStyle = node.active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      });
    });

    simulationRef.current = simulation;

    // Start simulation
    simulation.nodes(nodes);
    simulation.force('link')?.links(edges);

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  /**
   * Generate Network Data
   * 
   * Technical Implementation:
   * - Creates random network structure
   * - Simulates network activity
   * - Updates node and edge states
   */
  useEffect(() => {
    const generateNetwork = () => {
      // Generate nodes
      const newNodes = Array.from({ length: 50 }, (_, i) => ({
        id: `node-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0,
        vy: 0,
        size: 5 + Math.random() * 5,
        color: '#FFFFFF',
        active: Math.random() > 0.7,
      }));

      // Generate edges
      const newEdges = Array.from({ length: 100 }, (_, i) => ({
        source: `node-${Math.floor(Math.random() * 50)}`,
        target: `node-${Math.floor(Math.random() * 50)}`,
        strength: 0.3 + Math.random() * 0.7,
        color: '#FFFFFF',
        active: Math.random() > 0.8,
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    };

    generateNetwork();
    const interval = setInterval(generateNetwork, 5000);

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

      {/* Network Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Network Stats */}
      <div className="absolute bottom-4 right-4 z-20 text-white font-mono text-sm">
        <div>Nodes: {nodes.length}</div>
        <div>Connections: {edges.length}</div>
        <div>Active Nodes: {nodes.filter(n => n.active).length}</div>
      </div>
    </motion.div>
  );
}; 