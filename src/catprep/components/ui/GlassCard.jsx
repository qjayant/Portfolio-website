import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({
  children,
  className = "",
  hoverEffect = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hoverEffect
          ? { scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }
          : {}
      }
      className={`glass-card ${className}`}
      style={{
        background: "rgba(30, 41, 59, 0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "var(--radius-md)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "24px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        ...props.style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
