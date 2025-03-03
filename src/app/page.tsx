'use client';

import { Suspense } from 'react';
import { FeatureTour } from '@/components/core/FeatureTour';
import { CircuitBackground } from '@/components/three/CircuitBackground';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[rgb(var(--background))]">
      {/* 3D Circuit Background */}
      <div className="fixed inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <CircuitBackground />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-mono text-4xl mb-4 glitch-text">
            ROLODEXTER<span className="text-[rgb(var(--accent-neon))]">.CORE</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl">
            Next-generation network visualization and blockchain monitoring system.
            Explore the features below to understand the capabilities of this advanced platform.
          </p>
        </header>

        {/* Feature Tour */}
        <div className="h-[600px] w-full">
          <FeatureTour />
        </div>

        {/* System Status */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-foreground/5">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-[rgb(var(--accent-electric))] pulse-glow" />
                <span className="status-text">SYSTEM.ONLINE</span>
              </div>
              <div className="w-px h-4 bg-foreground/10" />
              <span className="status-text">VER.4.0.1</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-text">NETWORK.STATUS:</span>
              <span className="text-[rgb(var(--accent-neon))] font-mono text-xs">OPTIMAL</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
