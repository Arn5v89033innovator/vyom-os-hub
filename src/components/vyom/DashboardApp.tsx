import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Cpu, HardDrive, Wifi, Activity } from "lucide-react";

const generateData = () =>
  Array.from({ length: 20 }, (_, i) => ({
    time: i,
    cpu: 40 + Math.random() * 45,
    memory: 50 + Math.random() * 30,
    network: 10 + Math.random() * 80,
    disk: 30 + Math.random() * 20,
  }));

const DashboardApp = () => {
  const [data, setData] = useState(generateData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          cpu: 40 + Math.random() * 45,
          memory: 50 + Math.random() * 30,
          network: 10 + Math.random() * 80,
          disk: 30 + Math.random() * 20,
        }];
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  const stats = [
    { label: "CPU", value: latest.cpu, icon: Cpu, color: "hsl(185, 100%, 50%)" },
    { label: "Memory", value: latest.memory, icon: HardDrive, color: "hsl(260, 80%, 60%)" },
    { label: "Network", value: latest.network, icon: Wifi, color: "hsl(220, 90%, 60%)" },
    { label: "Disk I/O", value: latest.disk, icon: Activity, color: "hsl(150, 70%, 50%)" },
  ];

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <span className="font-display text-xs tracking-widest text-primary uppercase">Mission Control — Live</span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <s.icon className="w-3 h-3" style={{ color: s.color }} />
              <span className="font-body text-xs">{s.label}</span>
            </div>
            <div className="font-display text-lg" style={{ color: s.color }}>
              {s.value.toFixed(1)}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${s.value}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="glass rounded-lg p-3">
          <span className="font-body text-xs text-muted-foreground mb-2 block">CPU & Memory</span>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 30%, 15%)" />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 20%, 10%)",
                  border: "1px solid hsl(200, 30%, 20%)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "Share Tech Mono",
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="hsl(185, 100%, 50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memory" stroke="hsl(260, 80%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-lg p-3">
          <span className="font-body text-xs text-muted-foreground mb-2 block">Network Traffic</span>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 30%, 15%)" />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 20%, 10%)",
                  border: "1px solid hsl(200, 30%, 20%)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "Share Tech Mono",
                }}
              />
              <Area type="monotone" dataKey="network" stroke="hsl(220, 90%, 60%)" fill="hsl(220, 90%, 60%, 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;
