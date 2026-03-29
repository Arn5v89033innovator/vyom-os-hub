import { useState, useCallback } from "react";
import { WindowState } from "./types";

const defaultApps: Record<string, Omit<WindowState, "isOpen" | "isMinimized" | "isMaximized" | "zIndex">> = {
  notes: { id: "notes", title: "Notes", icon: "📝", position: { x: 100, y: 60 }, size: { width: 500, height: 400 } },
  terminal: { id: "terminal", title: "Terminal", icon: "⬛", position: { x: 150, y: 80 }, size: { width: 600, height: 400 } },
  dashboard: { id: "dashboard", title: "Mission Dashboard", icon: "📊", position: { x: 80, y: 50 }, size: { width: 700, height: 500 } },
  settings: { id: "settings", title: "Settings", icon: "⚙️", position: { x: 200, y: 100 }, size: { width: 500, height: 450 } },
  assistant: { id: "assistant", title: "VYOM AI", icon: "🤖", position: { x: 250, y: 70 }, size: { width: 420, height: 520 } },
};

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZ, setMaxZ] = useState(10);

  const openWindow = useCallback((appId: string) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === appId);
      if (existing) {
        return prev.map((w) =>
          w.id === appId ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
        );
      }
      const app = defaultApps[appId];
      if (!app) return prev;
      return [
        ...prev,
        { ...app, isOpen: true, isMinimized: false, isMaximized: false, zIndex: maxZ + 1 },
      ];
    });
    setMaxZ((z) => z + 1);
  }, [maxZ]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setMaxZ((z) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: z + 1 } : w)));
      return z + 1;
    });
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setMaxZ((z) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: z + 1 } : w)));
      return z + 1;
    });
  }, []);

  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position } : w)));
  }, []);

  const snapWindow = useCallback((id: string, side: "left" | "right") => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const x = side === "left" ? 0 : window.innerWidth / 2;
        return {
          ...w,
          position: { x, y: 0 },
          size: { width: window.innerWidth / 2, height: window.innerHeight - 56 },
          isMaximized: false,
        };
      })
    );
  }, []);

  const activeWindows = windows.filter((w) => w.isOpen && !w.isMinimized);
  const taskbarWindows = windows.filter((w) => w.isOpen);

  return {
    windows,
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
  };
};
