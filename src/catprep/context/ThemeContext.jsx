import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme] = useState("dark"); // Always dark

  useEffect(() => {
    // Enforce dark theme on mount
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("cat_prep_theme", "dark");
  }, []);

  const toggleTheme = () => {
    // No-op or log warning
    console.warn("Theme toggle is disabled. Dark mode is enforced.");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
