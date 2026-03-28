import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Cpu, Wifi, BatteryFull, Volume2 } from "lucide-react";
import { WindowState, DesktopApp } from "./types";

interface TaskbarProps {
  taskbarWindows: WindowState[];
  onWindowClick: (id: string) => void;
  onOpenApp: (id: string) => void;
  apps: DesktopApp[];
}

const Taskbar = ({ taskbarWindows, onWindowClick, onOpenApp, apps }: TaskbarProps) => {
  const [time, setTime] = useState(new Date());
  const [showLauncher, setShowLauncher] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredApps = apps.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-14 glass-strong border-t border-border z-50 flex items-center px-4 gap-3">
        {/* Start button */}
        <button
          onClick={() => setShowLauncher(!showLauncher)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
        >
          <span className="font-display text-primary text-xs tracking-widest neon-text">V</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-border" />

        {/* Running apps */}
        <div className="flex items-center gap-1 flex-1">
          {taskbarWindows.map((w) => (
            <button
              key={w.id}
              onClick={() => onWindowClick(w.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body transition-all ${
                w.isMinimized
                  ? "bg-secondary/30 text-muted-foreground"
                  : "bg-primary/10 text-foreground border border-primary/15"
              }`}
            >
              <span>{w.icon}</span>
              <span className="hidden sm:inline">{w.title}</span>
            </button>
          ))}
        </div>

        {/* System tray */}
        <div className="flex items-center gap-3 text-muted-foreground">
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <BatteryFull className="w-3.5 h-3.5 text-primary" />
          <Cpu className="w-3.5 h-3.5 animate-pulse-glow" />
          <div className="w-px h-4 bg-border" />
          <div className="text-right font-mono-tech text-xs">
            <div className="text-foreground/80">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            <div className="text-muted-foreground text-[10px]">{time.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* App Launcher */}
      <AnimatePresence>
        {showLauncher && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowLauncher(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-16 left-4 w-72 glass-strong rounded-xl p-4 z-50 neon-glow-sm"
            >
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search apps..."
                  autoFocus
                  className="w-full bg-secondary/50 border border-border rounded-lg py-2 pl-9 pr-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30"
                />
              </div>
              <div className="space-y-1">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onOpenApp(app.id);
                      setShowLauncher(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-left"
                  >
                    <span className="text-lg">{app.icon}</span>
                    <span className="font-body text-sm text-foreground">{app.title}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="font-mono-tech text-[10px] text-muted-foreground text-center">
                  VYOM OS v3.7.1 • ALL SYSTEMS NOMINAL
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Taskbar;
