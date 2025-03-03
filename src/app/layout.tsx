import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Rolodexter",
  description: "Next-generation network visualization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-white text-foreground antialiased">
        {/* Circuit Connection Lines */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="connection-line h-px w-1/3 top-24 left-0" />
          <div className="connection-line h-px w-1/4 top-48 right-0" />
          <div className="connection-line w-px h-1/3 top-0 left-24" />
          <div className="connection-line w-px h-1/4 bottom-0 right-48" />
          
          {/* Diagonal Lines */}
          <div className="connection-line w-px h-48 origin-top-left rotate-45 top-32 left-1/4" />
          <div className="connection-line w-px h-48 origin-top-right -rotate-45 top-32 right-1/4" />
        </div>

        {/* HUD Elements */}
        <div className="fixed top-4 right-4 font-mono text-xs tracking-wider text-accent">
          <div className="flex items-center space-x-2">
            <span className="animate-pulse">●</span>
            <span>[system.status: active]</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>

        {/* Footer Status */}
        <div className="fixed bottom-0 left-0 w-full py-2 px-4 font-mono text-xs tracking-wider text-foreground/60 text-center border-t border-foreground/10 backdrop-blur-sm bg-white/80">
          <span className="animate-pulse">⟨</span> system.core.initialized <span className="animate-pulse">⟩</span>
        </div>
      </body>
    </html>
  );
}
