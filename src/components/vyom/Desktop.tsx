import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindowManager } from "./useWindowManager";
import { DesktopApp, Notification } from "./types";
import Taskbar from "./Taskbar";
import DesktopIcon from "./DesktopIcon";
import AppWindow from "./AppWindow";
import NotesApp from "./NotesApp";
import TerminalApp from "./TerminalApp";
import DashboardApp from "./DashboardApp";
import SettingsApp from "./SettingsApp";
import AIAssistantApp from "./AIAssistantApp";
import NotificationPopup from "./NotificationPopup";
import VoiceControl from "./VoiceControl";
import DesktopWidgets from "./DesktopWidgets";

const apps: DesktopApp[] = [
  { id: "notes", title: "Notes", icon: "📝" },
  { id: "terminal", title: "Terminal", icon: "⬛" },
  { id: "dashboard", title: "Mission Dashboard", icon: "📊" },
  { id: "settings", title: "Settings", icon: "⚙️" },
  { id: "assistant", title: "VYOM AI", icon: "🤖" },
];

const Desktop = () => {
  const {
    activeWindows,
    taskbarWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    focusWindow,
    updatePosition,
    snapWindow,
  } = useWindowManager();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [snapIndicator, setSnapIndicator] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  const notify = useCallback((title: string, message: string) => {
    const notif: Notification = { id: Date.now().toString(), title, message, timestamp: new Date() };
    setNotifications((prev) => [...prev, notif]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 3000);
  }, []);

  const handleOpenApp = useCallback((id: string) => {
    openWindow(id);
    const app = apps.find((a) => a.id === id);
    if (app) notify(app.title, `${app.title} opened`);
  }, [openWindow, notify]);

  const handleWindowClick = useCallback((id: string) => {
    focusWindow(id);
  }, [focusWindow]);

  const handleAICommand = useCallback((cmd: string) => {
    handleOpenApp(cmd);
  }, [handleOpenApp]);

  const handleDragPosition = useCallback((id: string, pos: { x: number; y: number }) => {
    updatePosition(id, pos);
    // Show snap indicators
    if (pos.x <= 5) {
      setSnapIndicator("left");
    } else if (pos.x + 100 >= window.innerWidth - 5) {
      setSnapIndicator("right");
    } else {
      setSnapIndicator(null);
    }
  }, [updatePosition]);

  const handleDragEnd = useCallback((id: string, pos: { x: number; y: number }) => {
    if (pos.x <= 5) {
      snapWindow(id, "left");
    } else if (pos.x + 100 >= window.innerWidth - 5) {
      snapWindow(id, "right");
    }
    setSnapIndicator(null);
  }, [snapWindow]);

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "notes": return <NotesApp />;
      case "terminal": return <TerminalApp />;
      case "dashboard": return <DashboardApp />;
      case "settings": return <SettingsApp darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />;
      case "assistant": return <AIAssistantApp onCommand={handleAICommand} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(hsl(var(--neon-cyan) / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--neon-cyan) / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />

      {/* Snap indicators */}
      {snapIndicator && (
        <div className={`fixed top-0 ${snapIndicator === "left" ? "left-0" : "right-0"} w-1/2 h-[calc(100vh-56px)] border-2 border-primary/40 bg-primary/5 z-40 pointer-events-none rounded-lg transition-opacity`} />
      )}

      {/* Desktop icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        {apps.map((app, i) => (
          <DesktopIcon
            key={app.id}
            icon={app.icon}
            title={app.title}
            onClick={() => handleOpenApp(app.id)}
            delay={i * 0.1}
          />
        ))}
      </div>

      {/* Desktop Widgets */}
      <DesktopWidgets />

      {/* Windows */}
      <AnimatePresence>
        {activeWindows.map((win) => (
          <AppWindow
            key={win.id}
            window={win}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onToggleMaximize={() => toggleMaximize(win.id)}
            onFocus={() => focusWindow(win.id)}
            onUpdatePosition={(pos) => handleDragPosition(win.id, pos)}
            onDragEnd={(pos) => handleDragEnd(win.id, pos)}
          >
            {renderAppContent(win.id)}
          </AppWindow>
        ))}
      </AnimatePresence>

      {/* Floating voice control */}
      <div className="fixed bottom-20 right-4 z-50">
        <VoiceControl onTranscript={(text) => {
          const lower = text.toLowerCase();
          if (lower.includes("open notes")) handleOpenApp("notes");
          else if (lower.includes("open terminal")) handleOpenApp("terminal");
          else if (lower.includes("open dashboard")) handleOpenApp("dashboard");
          else if (lower.includes("open settings")) handleOpenApp("settings");
          else if (lower.includes("assistant") || lower.includes("vyom")) handleOpenApp("assistant");
          else {
            handleOpenApp("assistant");
            notify("VYOM Voice", `"${text}"`);
          }
        }} />
      </div>

      {/* Notifications */}
      <NotificationPopup notifications={notifications} />

      {/* Taskbar */}
      <Taskbar
        taskbarWindows={taskbarWindows}
        onWindowClick={handleWindowClick}
        onRestoreWindow={restoreWindow}
        onOpenApp={handleOpenApp}
        apps={apps}
      />
    </div>
  );
};

export default Desktop;
