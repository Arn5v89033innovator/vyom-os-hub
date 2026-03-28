import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, ChevronRight } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      if (password === "vyom" || password === "") {
        onLogin();
      } else {
        setError("Access denied. Try password: vyom");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--neon-cyan) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--neon-cyan) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 animate-scan-line"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-primary/30 mb-4 animate-glow-ring">
            <span className="font-display text-2xl font-bold text-primary neon-text">V</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-primary neon-text tracking-widest">
            VYOM OS
          </h1>
          <p className="font-mono-tech text-muted-foreground text-sm mt-2">
            SYSTEM v3.7.1 // SECURE ACCESS REQUIRED
          </p>
        </motion.div>

        {/* Login form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleLogin}
          className="glass rounded-xl p-8 neon-glow-sm space-y-5"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="OPERATOR ID"
              className="w-full bg-secondary/50 border border-border rounded-lg py-3 pl-10 pr-4 text-foreground font-mono-tech text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ACCESS KEY"
              className="w-full bg-secondary/50 border border-border rounded-lg py-3 pl-10 pr-4 text-foreground font-mono-tech text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-destructive text-sm font-mono-tech"
              >
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary/10 border border-primary/30 text-primary font-display text-sm tracking-widest py-3 rounded-lg hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
              />
            ) : (
              <>
                INITIALIZE SESSION
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-muted-foreground text-xs font-mono-tech">
            Leave password empty or use "vyom"
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
