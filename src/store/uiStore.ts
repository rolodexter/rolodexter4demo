// src/store/uiStore.ts
import { create } from 'zustand';

interface Feature {
  id: string;
  x: number;
  y: number;
  text: string;
  description: string;
}

interface UIState {
  // Feature Tour State
  isTouring: boolean;
  currentFeature: number;
  tourProgress: number;
  features: Feature[];
  hoveredFeature: string | null;
  
  // Visual Effects
  glitchIntensity: number;
  cursorDensity: number;
  
  // Actions
  startTour: () => void;
  nextFeature: () => void;
  setHoveredFeature: (id: string | null) => void;
  setGlitchIntensity: (value: number) => void;
  setCursorDensity: (value: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isTouring: false,
  currentFeature: -1,
  tourProgress: 0,
  hoveredFeature: null,
  glitchIntensity: 0,
  cursorDensity: 0.5,
  
  // Sample features
  features: [
    {
      id: 'network-graph',
      x: 200,
      y: 150,
      text: 'NETWORK.GRAPH',
      description: 'Real-time visualization of node connections and data flow patterns across the network.'
    },
    {
      id: 'blockchain-layer',
      x: 500,
      y: 180,
      text: 'BLOCKCHAIN.LAYER',
      description: 'Monitor transaction status, block creation and validation across multiple chains.'
    },
    {
      id: 'hypersocial-feed',
      x: 300,
      y: 350, 
      text: 'HYPERSOCIAL.FEED',
      description: 'Track user engagement metrics and content propagation across social platforms.'
    },
    {
      id: 'system-status',
      x: 600,
      y: 400,
      text: 'SYSTEM.STATUS',
      description: 'Real-time performance metrics, uptime monitoring, and system health indicators.'
    }
  ],
  
  // Actions
  startTour: () => set({ isTouring: true, currentFeature: 0, tourProgress: 0 }),
  
  nextFeature: () => set((state) => {
    const nextIndex = (state.currentFeature + 1) % state.features.length;
    const progress = (nextIndex / state.features.length) * 100;
    
    return {
      currentFeature: nextIndex,
      tourProgress: progress
    };
  }),
  
  setHoveredFeature: (id) => set({ hoveredFeature: id }),
  
  setGlitchIntensity: (value) => set({ glitchIntensity: value }),
  
  setCursorDensity: (value) => set({ cursorDensity: value })
}));
