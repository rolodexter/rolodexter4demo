'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

// Define interfaces for network data
interface Node {
  id: string;
  group: number;
  radius: number;
  x?: number;
  y?: number;
}

interface Edge {
  source: string;
  target: string;
  value: number;
}

interface NetworkData {
  nodes: Node[];
  edges: Edge[];
}

interface NetworkGraphProps {
  width?: number;
  height?: number;
  data?: NetworkData;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  width = 800,
  height = 600,
  data = { nodes: [], edges: [] }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simulation, setSimulation] = useState<d3.Simulation<Node, Edge> | null>(null);

  // Initialize D3 force simulation
  useEffect(() => {
    if (!canvasRef.current) return;

    const simulation = d3.forceSimulation<Node>(data.nodes)
      .force('link', d3.forceLink<Node, Edge>(data.edges)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d.radius || 5) + 2));

    setSimulation(simulation);

    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  // Handle canvas rendering
  useEffect(() => {
    if (!canvasRef.current || !simulation) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Set up high DPI canvas
    const pixelRatio = window.devicePixelRatio || 1;
    canvasRef.current.width = width * pixelRatio;
    canvasRef.current.height = height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);

    // Update function for each simulation tick
    simulation.on('tick', () => {
      context.clearRect(0, 0, width, height);

      // Draw edges
      context.strokeStyle = '#999';
      context.lineWidth = 0.5;
      data.edges.forEach(edge => {
        const source = data.nodes.find(n => n.id === edge.source);
        const target = data.nodes.find(n => n.id === edge.target);
        if (source && target && source.x && source.y && target.x && target.y) {
          context.beginPath();
          context.moveTo(source.x, source.y);
          context.lineTo(target.x, target.y);
          context.stroke();
        }
      });

      // Draw nodes
      data.nodes.forEach(node => {
        if (node.x === undefined || node.y === undefined) return;

        context.beginPath();
        context.fillStyle = d3.schemeCategory10[node.group % 10];
        context.arc(node.x, node.y, node.radius || 5, 0, 2 * Math.PI);
        context.fill();
      });
    });
  }, [simulation, data, width, height]);

  // Generate random network data for testing
  useEffect(() => {
    const interval = setInterval(() => {
      // Update node positions or add/remove nodes here
      if (simulation) {
        simulation.alpha(0.3).restart();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [simulation]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="border border-gray-200 rounded-lg shadow-lg"
      />
    </motion.div>
  );
};

export default NetworkGraph; 