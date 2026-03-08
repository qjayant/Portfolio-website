import React, { useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { useStudy } from "../context/StudyContext";
import { usePageSEO } from "../hooks/usePageSEO";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PomodoroHeaderTimer from "../components/PomodoroHeaderTimer";

const TaskItem = ({ task, dayIndex, markTaskComplete, toggleSubtopic }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <GlassCard
      style={{
        padding: "0",
        opacity: task.completed ? 0.7 : 1,
        overflow: "hidden",
        background: "var(--bg-card)",
        border: "var(--glass-border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flex: 1,
          }}
          onClick={() => markTaskComplete(dayIndex, task.id)}
        >
          <div
            style={{
              color: task.completed ? "#4ade80" : "var(--text-secondary)",
              transition: "color 0.3s ease",
              flexShrink: 0,
            }}
          >
            {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                textDecoration: task.completed ? "line-through" : "none",
                color: "var(--text-primary)",
              }}
            >
              {task.topic}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              {task.subject}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              background:
                task.subject === "QA"
                  ? "#6366f1"
                  : task.subject === "VARC"
                    ? "#f43f5e"
                    : "#fb923c",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {task.subject}
          </span>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            style={{
              padding: "8px",
              borderRadius: "50%",
              background: "var(--bg-button)",
              border: "var(--glass-border)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-button-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg-button)")
            }
          >
            {isExpanded ? (
              <ChevronUp size={20} color="var(--text-primary)" />
            ) : (
              <ChevronDown size={20} color="var(--text-primary)" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && task.subtopics && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            style={{ overflow: "hidden", background: "var(--bg-glass)" }}
          >
            <div style={{ padding: "0 20px 20px 60px" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "var(--text-secondary)",
                }}
              >
                Subtopics:
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "0",
                  listStyle: "none",
                  color: "var(--text-secondary)",
                }}
              >
                {task.subtopics.map((sub, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      transition: "background 0.2s",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubtopic(dayIndex, task.id, idx);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      style={{
                        color: sub.completed
                          ? "#4ade80"
                          : "var(--text-secondary)",
                      }}
                    >
                      {sub.completed ? (
                        <CheckSquare size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                    </div>
                    <span
                      style={{
                        textDecoration: sub.completed ? "line-through" : "none",
                        color: sub.completed
                          ? "var(--text-secondary)"
                          : "var(--text-primary)",
                      }}
                    >
                      {sub.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

const Dashboard = () => {
  const { user, plan, progress, markTaskComplete, toggleSubtopic } = useStudy();
  usePageSEO(
    "Dashboard",
    "Track your daily CAT preparation progress. View today's tasks, completion stats, and exam countdown.",
  );

  const joinedAt = new Date(user?.joinedAt);
  const now = new Date();
  const diffTime = Math.abs(now - joinedAt);
  const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const todaysPlan = plan[dayIndex];

  // Calculate stats
  const completedTasks = progress.completedCount || 0;
  const totalTasks = plan.reduce((acc, day) => acc + day.tasks.length, 0);
  const progressPercentage = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div>
      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "28px",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            Hello, {user?.name} <span>👋</span>
          </h1>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Here is your focus for Day {dayIndex + 1}
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
        {/* <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "var(--font-main)",
            backdropFilter: "blur(12px)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)";
            e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.4)";
            e.currentTarget.style.color = "#f8fafc";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <span style={{ fontSize: "16px" }}>👋</span>
          Meet the Developer
        </Link> */}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <GlassCard hoverEffect={true}>
          <h3 style={{ color: "var(--text-primary)" }}>Daily Progress</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              margin: "16px 0",
              color: "var(--text-primary)",
            }}
          >
            {todaysPlan
              ? todaysPlan.tasks.filter((t) => t.completed).length
              : 0}
            <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
              {" "}
              / {todaysPlan?.tasks?.length || 0} Tasks
            </span>
          </p>
          <div
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.1)",
              height: "8px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: `${todaysPlan && todaysPlan.tasks.length > 0 ? (todaysPlan.tasks.filter((t) => t.completed).length / todaysPlan.tasks.length) * 100 : 0}%`,
                background: "var(--primary-gradient)",
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.5s ease",
              }}
            ></div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true}>
          <h3 style={{ color: "var(--text-primary)" }}>Total Coverage</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              margin: "16px 0",
              color: "var(--text-primary)",
            }}
          >
            {progressPercentage}%
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Keep going to reach 100%!
          </p>
        </GlassCard>

        <GlassCard hoverEffect={true}>
          <h3 style={{ color: "var(--text-primary)" }}>Exam Countdown</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              margin: "16px 0",
              color: "var(--text-primary)",
            }}
          >
            {Math.ceil(
              (new Date(user?.examDate) - new Date()) / (1000 * 60 * 60 * 24),
            )}
            <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
              {" "}
              Days Left
            </span>
          </p>
        </GlassCard>
      </div>

      <h2 style={{ marginBottom: "24px", color: "var(--text-primary)" }}>
        Today's Tasks
      </h2>

      {!todaysPlan && (
        <GlassCard>
          <p style={{ color: "var(--text-primary)" }}>
            No plan for today. You might have finished everything or it's a rest
            day!
          </p>
        </GlassCard>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {todaysPlan?.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            dayIndex={dayIndex}
            markTaskComplete={markTaskComplete}
            toggleSubtopic={toggleSubtopic}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
