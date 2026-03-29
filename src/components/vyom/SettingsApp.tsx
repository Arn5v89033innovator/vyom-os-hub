import { useState } from "react";
import { Monitor, Palette, Info, Zap, Moon, Sun } from "lucide-react";

interface SettingsAppProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const SettingsApp = ({ darkMode, onToggleDarkMode }: SettingsAppProps) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <div className="h-full overflow-auto p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="font-display text-xs tracking-widest text-primary uppercase">System Settings</span>
      </div>

      {/* Appearance */}
      <div className="glass rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-foreground/80">
          <Palette className="w-4 h-4 text-primary" />
          <span className="font-body text-sm font-semibold">Appearance</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-3.5 h-3.5 text-muted-foreground" /> : <Sun className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className="font-body text-xs text-foreground/70">Dark Mode</span>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`w-10 h-5 rounded-full transition-colors relative ${darkMode ? "bg-primary/30" : "bg-secondary"}`}
          >
            <div
              className="w-4 h-4 rounded-full bg-primary absolute top-0.5 transition-all"
              style={{ left: darkMode ? "22px" : "2px" }}
            />
          </button>
        </div>
      </div>

      {/* Performance */}
      <div className="glass rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-foreground/80">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-body text-sm font-semibold">Performance</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-foreground/70">Enable Animations</span>
          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative ${animationsEnabled ? "bg-primary/30" : "bg-secondary"}`}
          >
            <div
              className="w-4 h-4 rounded-full bg-primary absolute top-0.5 transition-all"
              style={{ left: animationsEnabled ? "22px" : "2px" }}
            />
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="glass rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-foreground/80">
          <Info className="w-4 h-4 text-primary" />
          <span className="font-body text-sm font-semibold">System Information</span>
        </div>
        <div className="space-y-2 font-mono-tech text-[11px]">
          {[
            ["OS", "VYOM OS v3.7.1"],
            ["Kernel", "Quantum 9.2"],
            ["Architecture", "x86_64"],
            ["Shell", "VyomSH 2.0"],
            ["Renderer", "React 18 + Vite"],
            ["Display", "WebGL 2.0"],
            ["CPU", "Quantum Core i∞ @ 5.0 THz"],
            ["Memory", "256 PB DDR∞"],
          ].map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-muted-foreground">{key}</span>
              <span className="text-foreground/80">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="glass rounded-lg p-4">
        <div className="flex items-center gap-2 text-foreground/80 mb-2">
          <Monitor className="w-4 h-4 text-primary" />
          <span className="font-body text-sm font-semibold">About VYOM OS</span>
        </div>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          VYOM OS is a futuristic browser-based operating system inspired by mission control systems and AI assistants. Built with React, Tailwind CSS, and love for space technology.
        </p>
      </div>
    </div>
  );
};

export default SettingsApp;
