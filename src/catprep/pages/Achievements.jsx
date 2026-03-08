import React from "react";
import GlassCard from "../components/ui/GlassCard";
import { useStudy } from "../context/StudyContext";
import { BADGES } from "../data/badges";
import { motion } from "framer-motion";
import { usePageSEO } from "../hooks/usePageSEO";
import PomodoroHeaderTimer from "../components/PomodoroHeaderTimer";

const Achievements = () => {
  const { progress } = useStudy();
  usePageSEO(
    "Achievements & Badges",
    "Track your CAT preparation milestones. Earn badges for consistency, task completion, and study streaks.",
  );
  const unlockedBadges = progress.badges || [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px 0" }}>Your Achievements</h1>
          <p style={{ margin: 0 }}>
            Unlock badges by maintaining consistency and completing tasks!
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <PomodoroHeaderTimer />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const Icon = badge.icon;

          return (
            <GlassCard
              key={badge.id}
              style={{
                opacity: isUnlocked ? 1 : 0.5,
                filter: isUnlocked ? "none" : "grayscale(100%)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: isUnlocked
                    ? `${badge.color}20`
                    : "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isUnlocked ? badge.color : "white",
                  border: isUnlocked
                    ? `2px solid ${badge.color}`
                    : "2px solid transparent",
                }}
              >
                <Icon size={32} />
              </div>

              <div>
                <h3 style={{ margin: "0 0 8px 0" }}>{badge.name}</h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {badge.description}
                </p>
              </div>

              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: badge.color,
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginTop: "8px",
                  }}
                >
                  Unlocked
                </motion.div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
