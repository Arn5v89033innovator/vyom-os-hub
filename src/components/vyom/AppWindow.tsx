import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { WindowState } from "./types";

interface AppWindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (pos: { x: number; y: number }) => void;
  children: React.ReactNode;
}

const AppWindow = ({
  window: win,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onUpdatePosition,
  children,
}: AppWindowProps) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const style = win.isMaximized
    ? { top: 0, left: 0, width: "100%", height: "calc(100vh - 56px)", zIndex: win.zIndex }
    : {
        top: win.position.y,
        left: win.position.x,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      onUpdatePosition({
        x: e.clientX - dragOffset.current.x,
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, onUpdatePosition]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    setIsDragging(true);
    onFocus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed glass-strong rounded-xl overflow-hidden shadow-2xl flex flex-col"
      style={style}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        ref={dragRef}
        onMouseDown={handleDragStart}
        onDoubleClick={onToggleMaximize}
        className="flex items-center justify-between px-4 py-2.5 bg-secondary/50 border-b border-border cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{win.icon}</span>
          <span className="font-display text-xs tracking-wider text-foreground/80 uppercase">
            {win.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <Minus className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={onToggleMaximize}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            {win.isMaximized ? (
              <Minimize2 className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Maximize2 className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-destructive/20 transition-colors"
          >
            <X className="w-3 h-3 text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </motion.div>
  );
};

export default AppWindow;
