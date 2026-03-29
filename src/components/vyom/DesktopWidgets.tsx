import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, Cpu, CloudSun, Thermometer } from "lucide-react";

interface WidgetProps {
  initialPos: { x: number; y: number };
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}

const DraggableWidget = ({ initialPos, children, title, icon }: WidgetProps) => {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - offset.current.x, y: Math.max(0, e.clientY - offset.current.y) });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed glass rounded-xl p-3 cursor-grab active:cursor-grabbing select-none neon-glow-sm z-20"
      style={{ left: pos.x, top: pos.y, minWidth: 160 }}
      onMouseDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        setDragging(true);
      }}
    >
      <div className="flex items-center gap-2 mb-2 pointer-events-none">
        {icon}
        <span className="font-display text-[10px] tracking-widest text-primary uppercase">{title}</span>
      </div>
      <div className="pointer-events-none">{children}</div>
    </motion.div>
  );
};

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <DraggableWidget initialPos={{ x: 180, y: 20 }} title="Clock" icon={<Clock className="w-3 h-3 text-primary" />}>
      <div className="font-mono-tech text-2xl text-foreground/90 tabular-nums">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div className="font-mono-tech text-[10px] text-muted-foreground mt-0.5">
        {time.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
      </div>
    </DraggableWidget>
  );
};

const SystemMonitorWidget = () => {
  const [cpu, setCpu] = useState(42);
  const [mem, setMem] = useState(61);
  useEffect(() => {
    const i = setInterval(() => {
      setCpu((v) => Math.max(10, Math.min(95, v + (Math.random() - 0.5) * 8)));
      setMem((v) => Math.max(30, Math.min(90, v + (Math.random() - 0.5) * 4)));
    }, 2000);
    return () => clearInterval(i);
  }, []);

  const Bar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between font-mono-tech text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground/80">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  return (
    <DraggableWidget initialPos={{ x: 180, y: 120 }} title="System" icon={<Cpu className="w-3 h-3 text-primary" />}>
      <div className="space-y-2 min-w-[140px]">
        <Bar label="CPU" value={cpu} color="bg-primary" />
        <Bar label="MEM" value={mem} color="bg-accent" />
      </div>
    </DraggableWidget>
  );
};

const WeatherWidget = () => {
  return (
    <DraggableWidget initialPos={{ x: 180, y: 240 }} title="Weather" icon={<CloudSun className="w-3 h-3 text-primary" />}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">☀️</span>
        <div>
          <div className="font-mono-tech text-lg text-foreground/90 flex items-center gap-1">
            28°C
            <Thermometer className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="font-mono-tech text-[10px] text-muted-foreground">Clear Sky • Bangalore</div>
        </div>
      </div>
    </DraggableWidget>
  );
};

const DesktopWidgets = () => (
  <>
    <ClockWidget />
    <SystemMonitorWidget />
    <WeatherWidget />
  </>
);

export default DesktopWidgets;
