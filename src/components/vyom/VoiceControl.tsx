import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceControlProps {
  onTranscript: (text: string) => void;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceControl = ({ onTranscript }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimText = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += t;
        } else {
          interimText += t;
        }
      }
      setInterim(interimText);
      if (finalText) {
        onTranscript(finalText);
        setInterim("");
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [onTranscript]);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  if (!SpeechRecognition) return null;

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className={`p-2.5 rounded-full border transition-all duration-300 ${
          isListening
            ? "bg-primary/20 border-primary/50 animate-glow-ring"
            : "bg-secondary/50 border-border hover:bg-primary/10 hover:border-primary/20"
        }`}
        title="Voice command"
      >
        {isListening ? (
          <Mic className="w-4 h-4 text-primary" />
        ) : (
          <MicOff className="w-4 h-4 text-muted-foreground" />
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-strong rounded-lg px-3 py-1.5 neon-glow-sm whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="font-mono-tech text-[10px] text-primary">
                {interim || "Listening..."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceControl;
