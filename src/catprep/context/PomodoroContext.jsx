import React, { createContext, useContext, useState, useEffect } from "react";

const PomodoroContext = createContext();

export const usePomodoro = () => useContext(PomodoroContext);

export const PomodoroProvider = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(() => {
    const saved = localStorage.getItem("pomodoro_work");
    return saved ? parseInt(saved) : 25;
  });
  const [breakDuration, setBreakDuration] = useState(() => {
    const saved = localStorage.getItem("pomodoro_break");
    return saved ? parseInt(saved) : 5;
  });
  const [targetLaps, setTargetLaps] = useState(() => {
    const saved = localStorage.getItem("pomodoro_target");
    return saved ? parseInt(saved) : 4;
  });

  const [mode, setMode] = useState("work"); // 'work' or 'break'
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState(() => {
    const saved = localStorage.getItem("pomodoro_laps");
    return saved ? JSON.parse(saved) : {}; // Store laps per day { "YYYY-MM-DD": 3 }
  });

  const playTick = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.05,
      );
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.05,
      );
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.log("Audio play prevented:", e);
    }
  };

  const playBell = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 1.5,
      );
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.log("Audio play prevented:", e);
    }
  };

  const getTodayStr = () => new Date().toISOString().split("T")[0];

  // Save durations
  useEffect(() => {
    localStorage.setItem("pomodoro_work", workDuration);
    localStorage.setItem("pomodoro_break", breakDuration);
    localStorage.setItem("pomodoro_target", targetLaps);
  }, [workDuration, breakDuration, targetLaps]);

  // Save laps
  useEffect(() => {
    localStorage.setItem("pomodoro_laps", JSON.stringify(laps));
  }, [laps]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (mode === "work") {
          // Play a very subtle synthesized tick sound
          playTick();
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Play synthesized bell on transition
      playBell();

      if (mode === "work") {
        const today = getTodayStr();
        const newLaps = (laps[today] || 0) + 1;
        setLaps((prev) => ({
          ...prev,
          [today]: newLaps,
        }));

        if (newLaps >= targetLaps) {
          // Reached target laps! Stop the timer entirely.
          setMode("work");
          setTimeLeft(workDuration * 60);
          setIsActive(false);
        } else {
          setMode("break");
          setTimeLeft(breakDuration * 60);
        }
      } else {
        setMode("work");
        setTimeLeft(workDuration * 60);
      }
      // Note: We DO NOT set isActive(false) here unless we hit the target laps
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, workDuration, breakDuration, targetLaps, laps]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? workDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === "work" ? workDuration * 60 : breakDuration * 60);
  };

  const updateSettings = (newWork, newBreak, newTarget) => {
    setWorkDuration(newWork);
    setBreakDuration(newBreak);
    setTargetLaps(newTarget);
    if (!isActive) {
      setTimeLeft(mode === "work" ? newWork * 60 : newBreak * 60);
    }
  };

  const getTodayLaps = () => laps[getTodayStr()] || 0;

  return (
    <PomodoroContext.Provider
      value={{
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
        getTodayStr,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};
