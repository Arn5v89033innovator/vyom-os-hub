import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { ChatMessage } from "./types";
import VoiceControl from "./VoiceControl";

interface AIAssistantProps {
  onCommand?: (cmd: string) => void;
}

const mockResponses: Record<string, string> = {
  "open notes": "Opening Notes app for you... 📝",
  "open terminal": "Launching Terminal... ⬛",
  "open dashboard": "Opening Mission Dashboard... 📊",
  "open settings": "Opening Settings panel... ⚙️",
  "system status": "All systems nominal.\n• CPU: 78% utilization\n• Memory: 62% used\n• Network: Active, 245 Mbps\n• Storage: 48% capacity\n• No critical alerts.",
  "what is system status": "All systems nominal.\n• CPU: 78% utilization\n• Memory: 62% used\n• Network: Active, 245 Mbps\n• Storage: 48% capacity\n• No critical alerts.",
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase().trim();
  for (const [key, val] of Object.entries(mockResponses)) {
    if (lower.includes(key)) return val;
  }
  if (lower.includes("summarize")) {
    return "I can help summarize text! Paste the content and I'll create a concise summary for you. (Mock mode — no AI API connected)";
  }
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello, Operator! I'm VYOM, your AI assistant. How can I help you today? Try:\n• \"Open notes\"\n• \"What is system status?\"\n• \"Summarize this text\"";
  }
  if (lower.includes("who are you") || lower.includes("what are you")) {
    return "I am VYOM — Virtual Yield Optimization Module. An AI assistant built into VYOM OS to help you manage your workspace, access system information, and automate tasks.";
  }
  return "I understand your query. In full mode, I'd process this with AI. For now, try:\n• \"Open notes/terminal/dashboard\"\n• \"System status\"\n• \"Summarize this text\"";
};

const AIAssistantApp = ({ onCommand }: AIAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Greetings, Operator. I am VYOM — your AI assistant.\n\nHow may I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (overrideText?: string) => {
    const text = overrideText || input;
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const lower = text.toLowerCase().trim();
    if (lower.includes("open notes")) onCommand?.("notes");
    else if (lower.includes("open terminal")) onCommand?.("terminal");
    else if (lower.includes("open dashboard")) onCommand?.("dashboard");
    else if (lower.includes("open settings")) onCommand?.("settings");

    const response = getResponse(text);
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-xs font-body whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary/15 text-foreground border border-primary/20"
                  : "bg-secondary/50 text-foreground/90 border border-border"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3 h-3 text-accent" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask VYOM..."
            className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30"
          />
          <VoiceControl onTranscript={(text) => {
            handleSend(text);
          }} />
          <button
            onClick={() => handleSend()}
            className="p-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantApp;
