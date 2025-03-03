'use client';

import React, { useState } from 'react';
import CursorSimulation from '@/components/core/CursorSimulation';
import { motion } from 'framer-motion';

export default function CursorsPage() {
  const [cursorCount, setCursorCount] = useState(5);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Cursor Simulation</h1>
          <p className="text-gray-600">
            Watch multiple cursors move autonomously across the screen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cursors
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={cursorCount}
                onChange={(e) => setCursorCount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {cursorCount} cursors
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width
              </label>
              <input
                type="range"
                min="400"
                max="1200"
                step="100"
                value={dimensions.width}
                onChange={(e) => setDimensions(prev => ({
                  ...prev,
                  width: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {dimensions.width}px
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <input
                type="range"
                min="300"
                max="800"
                step="100"
                value={dimensions.height}
                onChange={(e) => setDimensions(prev => ({
                  ...prev,
                  height: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {dimensions.height}px
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <CursorSimulation
            width={dimensions.width}
            height={dimensions.height}
            cursorCount={cursorCount}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>
            Each cursor moves independently with randomized paths and timing.
            The grid overlay helps visualize the movement patterns.
          </p>
        </motion.div>
      </div>
    </main>
  );
} 