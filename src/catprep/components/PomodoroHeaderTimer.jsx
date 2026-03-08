import React, { useState } from "react";
import { usePomodoro } from "../context/PomodoroContext";
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Coffee,
  Settings,
  X,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PomodoroHeaderTimer = () => {
  const {
    mode,
    timeLeft,
    isActive,
    workDuration,
    breakDuration,
    targetLaps,
    toggleTimer,
    resetTimer,
    switchMode,
    updateSettings,
    getTodayLaps,
  } = usePomodoro();

  const [showSettings, setShowSettings] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tempWork, setTempWork] = useState(workDuration);
  const [tempBreak, setTempBreak] = useState(breakDuration);
  const [tempTargetLaps, setTempTargetLaps] = useState(targetLaps);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSaveSettings = () => {
    updateSettings(tempWork, tempBreak, tempTargetLaps);
    setShowSettings(false);
  };

  const laps = getTodayLaps();

  return (
    <div
      style={{ position: "relative", zIndex: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          padding: isHovered ? "10px 20px" : "8px 16px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: isHovered ? "16px" : "8px",
          background: "var(--bg-card)",
          border: "var(--glass-border)",
          borderRadius: "30px",
          boxShadow: "var(--glass-shadow)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Minimal Mode Icon (when not hovered) */}
        <AnimatePresence>
          {!isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              exit={{ opacity: 0, scale: 0.8, width: 0 }}
              style={{
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {mode === "work" ? (
                <Brain size={18} color="#c084fc" />
              ) : (
                <Coffee size={18} color="#2dd4bf" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Switches (when hovered) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              style={{ display: "flex", gap: "4px", overflow: "hidden" }}
            >
              <button
                onClick={() => switchMode("work")}
                style={{
                  background:
                    mode === "work" ? "var(--primary-gradient)" : "transparent",
                  border: "none",
                  color: mode === "work" ? "white" : "var(--text-secondary)",
                  padding: "6px 12px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <Brain size={16} /> Focus
              </button>
              <button
                onClick={() => switchMode("break")}
                style={{
                  background:
                    mode === "break"
                      ? "var(--primary-gradient)"
                      : "transparent",
                  border: "none",
                  color: mode === "break" ? "white" : "var(--text-secondary)",
                  padding: "6px 12px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <Coffee size={16} /> Break
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer & Laps Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Timer Display */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: isHovered ? "24px" : "20px",
              fontWeight: "bold",
              color: isActive ? "#4ade80" : "var(--text-primary)",
              minWidth: isHovered ? "75px" : "60px",
              textAlign: "center",
              letterSpacing: "1px",
              margin: isHovered ? "0 8px" : "0",
              transition: "all 0.3s ease",
            }}
          >
            {formatTime(timeLeft)}
          </div>

          {/* Laps Indicator */}
          <div
            style={{ display: "flex", gap: "4px", marginTop: "4px" }}
            title={`${laps} Focus sessions completed today out of ${targetLaps}`}
          >
            {Array.from({ length: targetLaps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: i < laps ? "#4ade80" : "var(--glass-border)",
                  boxShadow:
                    i < laps ? "0 0 8px rgba(74, 222, 128, 0.4)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls (when hovered) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <button
                onClick={toggleTimer}
                style={{
                  background: isActive
                    ? "rgba(244, 63, 94, 0.2)"
                    : "rgba(74, 222, 128, 0.2)",
                  color: isActive ? "#f43f5e" : "#4ade80",
                  border: "none",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                {isActive ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={resetTimer}
                style={{
                  background: "var(--bg-button)",
                  color: "var(--text-secondary)",
                  border: "none",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                <RotateCcw size={16} />
              </button>

              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "var(--glass-border)",
                  margin: "0 4px",
                }}
              />

              <button
                onClick={() => {
                  setTempWork(workDuration);
                  setTempBreak(breakDuration);
                  setTempTargetLaps(targetLaps);
                  setShowSettings(true);
                }}
                style={{
                  background: "transparent",
                  color: "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  transition: "color 0.3s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                <Settings size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Modal (Overlay) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              position: "absolute",
              top: "calc(100% + 16px)",
              right: 0,
              background: "var(--bg-card)",
              border: "var(--glass-border)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              width: "280px",
              zIndex: 200,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "var(--text-primary)",
                  fontSize: "16px",
                }}
              >
                Timer Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Focus Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={tempWork}
                onChange={(e) => setTempWork(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "var(--bg-glass)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={tempBreak}
                onChange={(e) => setTempBreak(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "var(--bg-glass)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Target Laps (sessions)
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={tempTargetLaps}
                onChange={(e) => setTempTargetLaps(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "var(--bg-glass)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <button
              onClick={handleSaveSettings}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "var(--primary-gradient)",
                border: "none",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Save Changes
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PomodoroHeaderTimer;
