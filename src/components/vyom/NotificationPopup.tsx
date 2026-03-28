import { motion, AnimatePresence } from "framer-motion";
import { Notification } from "./types";

interface NotificationPopupProps {
  notifications: Notification[];
}

const NotificationPopup = ({ notifications }: NotificationPopupProps) => (
  <div className="fixed top-4 right-4 z-[100] space-y-2">
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className="glass-strong rounded-lg p-3 neon-glow-sm min-w-[200px]"
        >
          <p className="font-display text-[10px] tracking-wider text-primary mb-0.5">{n.title}</p>
          <p className="font-body text-xs text-foreground/70">{n.message}</p>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default NotificationPopup;
