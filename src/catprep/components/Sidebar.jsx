import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Award,
  GraduationCap,
  Menu,
  X,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useStudy } from "../context/StudyContext";
import MeetDeveloperBtn from "./MeetDeveloperBtn";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { theme } = useTheme();
  const { user } = useStudy();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/catprep" },
    { icon: BookOpen, label: "Study Plan", path: "/catprep/plan" },
    { icon: BarChart2, label: "Analytics", path: "/catprep/analytics" },
    { icon: Award, label: "Achievements", path: "/catprep/achievements" },
    {
      icon: GraduationCap,
      label: "Call Predictor",
      path: "/catprep/predictor",
    },
  ];

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="catprep-hamburger"
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 60,
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: "var(--bg-card)",
          border: "var(--glass-border)",
          backdropFilter: "blur(12px)",
          color: "var(--text-primary)",
          display: "none" /* shown via CSS media query */,
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="catprep-sidebar-backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 49,
              display: "none" /* shown via CSS media query */,
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`catprep-sidebar ${isOpen ? "catprep-sidebar--open" : ""}`}
        style={{
          width: "280px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          borderRight: "var(--glass-border)",
          background: "var(--bg-sidebar)",
          backdropFilter: "blur(20px)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "transform 0.3s ease",
        }}
      >
        <div
          className="logo"
          style={{
            marginBottom: "48px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "var(--primary-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Target size={24} />
          </div>
          <h1
            style={{
              fontSize: "24px",
              background: "var(--text-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundImage: "var(--primary-gradient)",
            }}
          >
            CAT Prep
          </h1>
        </div>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/catprep"}
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                borderRadius: "16px",
                color: isActive ? "#fff" : "var(--text-secondary)",
                background: isActive
                  ? "var(--primary-gradient)"
                  : "transparent",
                transition: "all 0.3s ease",
                textDecoration: "none",
                fontWeight: isActive ? 600 : 400,
              })}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <MeetDeveloperBtn />
          <div
            className="user-profile"
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "var(--bg-glass)",
              border: "var(--glass-border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #f43f5e, #fb923c)",
              }}
            ></div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {user?.name || "Aspirant"}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}
              >
                Target: {user?.targetPercentile || "95+"}%ile
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
