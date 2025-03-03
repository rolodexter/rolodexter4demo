import { DataStreamSimulator } from '@/components/simulation/DataStreamSimulator';
import { CursorSimulation } from '@/components/simulation/CursorSimulation';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative w-full h-screen">
        <DataStreamSimulator />
        <CursorSimulation />
      </div>
    </main>
  );
} 