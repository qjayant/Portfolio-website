import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const MeetDeveloperBtn = () => {
  return (
    <NavLink
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 16px",
        borderRadius: "30px", // Align with Pomodoro pill shape
        color: "white",
        textDecoration: "none",
        background: "rgba(99, 102, 241, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontWeight: 600,
        fontSize: "14px",
        transition: "all 0.3s ease",
        height: "max-content",
        boxSizing: "border-box",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--primary-gradient)";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(99, 102, 241, 0.8)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
        style={{
          fontSize: "16px",
          display: "inline-block",
        }}
      >
        🧑‍💻
      </motion.span>{" "}
      Meet the Developer
    </NavLink>
  );
};

export default MeetDeveloperBtn;
