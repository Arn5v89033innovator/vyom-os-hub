import { useState, useRef, useEffect } from "react";

const TerminalApp = () => {
  const [lines, setLines] = useState<{ type: "input" | "output"; text: string }[]>([
    { type: "output", text: "VYOM Terminal v3.7.1" },
    { type: "output", text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const processCommand = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    const newLines: { type: "input" | "output"; text: string }[] = [
      { type: "input", text: `vyom@os:~$ ${cmd}` },
    ];

    switch (c) {
      case "help":
        newLines.push({
          type: "output",
          text: `Available commands:
  help        - Show this help
  clear       - Clear terminal
  date        - Current date/time
  whoami      - Current user
  uname       - System info
  status      - System status
  neofetch    - System overview
  echo <msg>  - Print message
  ping <host> - Simulate ping
  matrix      - Matrix mode`,
        });
        break;
      case "clear":
        setLines([]);
        setInput("");
        return;
      case "date":
        newLines.push({ type: "output", text: new Date().toString() });
        break;
      case "whoami":
        newLines.push({ type: "output", text: "operator@vyom-os" });
        break;
      case "uname":
        newLines.push({ type: "output", text: "VYOM OS v3.7.1 (x86_64) — Quantum Kernel 9.2" });
        break;
      case "status":
        newLines.push({
          type: "output",
          text: `┌─ SYSTEM STATUS ─────────────────┐
│ CPU:     ████████░░ 78%         │
│ Memory:  ██████░░░░ 62%         │
│ Network: ████████░░ Active      │
│ Storage: █████░░░░░ 48%         │
│ Uptime:  4d 7h 23m              │
└─────────────────────────────────┘`,
        });
        break;
      case "neofetch":
        newLines.push({
          type: "output",
          text: `
  ██╗   ██╗██╗   ██╗ ██████╗ ███╗   ███╗
  ██║   ██║╚██╗ ██╔╝██╔═══██╗████╗ ████║
  ██║   ██║ ╚████╔╝ ██║   ██║██╔████╔██║
  ╚██╗ ██╔╝  ╚██╔╝  ██║   ██║██║╚██╔╝██║
   ╚████╔╝    ██║   ╚██████╔╝██║ ╚═╝ ██║
    ╚═══╝     ╚═╝    ╚═════╝ ╚═╝     ╚═╝

  OS:       VYOM OS v3.7.1
  Kernel:   Quantum 9.2
  Shell:    VyomSH 2.0
  Terminal: VYOM Term
  CPU:      Quantum Core i∞ @ 5.0 THz
  RAM:      128 PB / 256 PB`,
        });
        break;
      case "matrix":
        newLines.push({ type: "output", text: "Wake up, Operator... The Matrix has you..." });
        break;
      default:
        if (c.startsWith("echo ")) {
          newLines.push({ type: "output", text: cmd.slice(5) });
        } else if (c.startsWith("ping ")) {
          const host = cmd.slice(5);
          newLines.push({
            type: "output",
            text: `PING ${host}: 64 bytes, time=12.4ms\nPING ${host}: 64 bytes, time=11.8ms\nPING ${host}: 64 bytes, time=13.1ms\n--- ${host} ping statistics ---\n3 packets transmitted, 3 received, 0% loss`,
          });
        } else if (c) {
          newLines.push({ type: "output", text: `Command not found: ${cmd}. Type "help" for commands.` });
        }
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput("");
  };

  return (
    <div className="h-full bg-background/80 flex flex-col font-mono-tech text-xs">
      <div className="flex-1 overflow-auto p-3 space-y-0.5">
        {lines.map((line, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap ${
              line.type === "input" ? "text-primary" : "text-foreground/80"
            }`}
          >
            {line.text}
          </pre>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-1 px-3 py-2 border-t border-border">
        <span className="text-primary">vyom@os:~$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && processCommand(input)}
          className="flex-1 bg-transparent text-foreground focus:outline-none"
          autoFocus
        />
      </div>
    </div>
  );
};

export default TerminalApp;
