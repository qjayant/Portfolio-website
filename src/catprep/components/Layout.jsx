import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStudy } from "../context/StudyContext";
import { Award, X } from "lucide-react";

const Layout = () => {
  const { newlyUnlockedBadge, setNewlyUnlockedBadge } = useStudy();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="catprep-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Achievement Unlock Popup — global, renders on any page */}
      <AnimatePresence>
        {newlyUnlockedBadge && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="catprep-achievement-popup"
            style={{
              position: "fixed",
              bottom: "40px",
              right: "40px",
              background: "rgba(30, 41, 59, 0.95)",
              border: `1px solid ${newlyUnlockedBadge.color}40`,
              padding: "24px 28px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              boxShadow: `0 12px 40px ${newlyUnlockedBadge.color}30, 0 0 60px ${newlyUnlockedBadge.color}10`,
              zIndex: 2000,
              backdropFilter: "blur(16px)",
              maxWidth: "420px",
            }}
          >
            {/* Animated badge icon */}
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
              style={{
                width: "56px",
                height: "56px",
                minWidth: "56px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${newlyUnlockedBadge.color}30, ${newlyUnlockedBadge.color}10)`,
                border: `2px solid ${newlyUnlockedBadge.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: newlyUnlockedBadge.color,
              }}
            >
              {newlyUnlockedBadge.icon ? (
                React.createElement(newlyUnlockedBadge.icon, { size: 28 })
              ) : (
                <Award size={28} />
              )}
            </motion.div>

            <div style={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: newlyUnlockedBadge.color,
                    marginBottom: "4px",
                  }}
                >
                  🎉 Achievement Unlocked!
                </div>
                <h3
                  style={{
                    margin: 0,
                    color: "var(--text-primary)",
                    fontSize: "17px",
                    fontWeight: 600,
                  }}
                >
                  {newlyUnlockedBadge.name}
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    lineHeight: 1.4,
                  }}
                >
                  {newlyUnlockedBadge.description}
                </p>
              </motion.div>
            </div>

            <button
              onClick={() => setNewlyUnlockedBadge(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
