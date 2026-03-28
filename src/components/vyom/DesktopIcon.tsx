import { motion } from "framer-motion";

interface DesktopIconProps {
  icon: string;
  title: string;
  onClick: () => void;
  delay?: number;
}

const DesktopIcon = ({ icon, title, onClick, delay = 0 }: DesktopIconProps) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    onClick={onClick}
    onDoubleClick={onClick}
    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 hover:neon-glow-sm transition-all duration-200 group w-24"
  >
    <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
      {icon}
    </div>
    <span className="font-body text-xs text-foreground/70 group-hover:text-foreground transition-colors text-center leading-tight">
      {title}
    </span>
  </motion.button>
);

export default DesktopIcon;
