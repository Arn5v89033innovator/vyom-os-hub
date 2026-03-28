import { useState } from "react";
import LoginScreen from "../components/vyom/LoginScreen";
import Desktop from "../components/vyom/Desktop";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!loggedIn ? (
        <motion.div key="login" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <LoginScreen onLogin={() => setLoggedIn(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Desktop />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
