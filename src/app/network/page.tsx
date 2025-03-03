'use client';

import React, { useEffect, useState } from 'react';
import NetworkGraph from '@/components/core/NetworkGraph';

// Generate random network data
const generateNetworkData = (nodeCount: number, edgeCount: number) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    group: Math.floor(Math.random() * 5),
    radius: Math.random() * 5 + 5,
  }));

  const edges = Array.from({ length: edgeCount }, () => {
    const source = nodes[Math.floor(Math.random() * nodes.length)].id;
    const target = nodes[Math.floor(Math.random() * nodes.length)].id;
    return {
      source,
      target,
      value: Math.random(),
    };
  });

  return { nodes, edges };
};

export default function NetworkPage() {
  const [networkData, setNetworkData] = useState(() => generateNetworkData(50, 100));

  // Update network data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(generateNetworkData(50, 100));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Network Visualization</h1>
        <p className="text-center mb-8 text-gray-600">
          Interactive network graph showing dynamic node relationships
        </p>
        <div className="flex justify-center">
          <NetworkGraph
            width={1000}
            height={600}
            data={networkData}
          />
        </div>
      </div>
    </main>
  );
} 