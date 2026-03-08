import React, { useState, useEffect, useRef } from "react";
import GlassCard from "../components/ui/GlassCard";
import { useStudy } from "../context/StudyContext";
import { usePageSEO } from "../hooks/usePageSEO";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  Edit2,
  X,
  Clock,
  Calendar,
  Target,
  CheckSquare,
  Square,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PomodoroHeaderTimer from "../components/PomodoroHeaderTimer";

const StudyPlan = () => {
  const {
    plan,
    markTaskComplete,
    user,
    startPrep,
    toggleSubtopic,
    showConsistencyToast,
    setShowConsistencyToast,
    currentStreak,
  } = useStudy();
  usePageSEO(
    "Study Plan",
    "Your personalized CAT study plan with daily topics for QA, VARC, and DILR. Track progress, mark tasks complete, and stay on schedule.",
  );
  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const dayRefs = useRef([]);

  useEffect(() => {
    // Find today's index or the first uncompleted day
    const todayIndex = plan.findIndex((day) => isToday(day.date));
    if (todayIndex !== -1 && dayRefs.current[todayIndex]) {
      // Small timeout to ensure DOM is ready and any initial animations are done
      setTimeout(() => {
        dayRefs.current[todayIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // Optionally auto-expand today's plan
        setExpandedDay(todayIndex);
      }, 500);
    }
  }, [plan]);

  const isToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editStartDate, setEditStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [editTargetPercentile, setEditTargetPercentile] = useState(
    user?.targetPercentile || "95+",
  );
  const [dateError, setDateError] = useState("");

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
    setExpandedTask(null);
  };

  const toggleTask = (e, taskId) => {
    e.stopPropagation();
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleDurationSelect = (months) => {
    const today = new Date();
    const targetDate = new Date(today.setMonth(today.getMonth() + months));
    startPrep(
      user.name,
      targetDate.toISOString().split("T")[0],
      new Date(),
      editTargetPercentile,
    );
    setShowEditModal(false);
  };

  const savePlanChanges = () => {
    if (editDate && editStartDate) {
      const s = new Date(editStartDate);
      const ex = new Date(editDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (ex <= today) {
        setDateError("Exam date must be in the future!");
        return;
      }
      if (s >= ex) {
        setDateError("Start date must be before exam date.");
        return;
      }
      const diffDays = Math.ceil((ex - s) / (1000 * 60 * 60 * 24));
      if (diffDays < 30) {
        setDateError(
          "Plan must be at least 30 days. CAT prep needs time to build a solid foundation!",
        );
        return;
      }
      setDateError("");
      startPrep(
        user.name,
        editDate,
        new Date(editStartDate),
        editTargetPercentile,
      );
      setShowEditModal(false);
      setEditDate("");
      setEditStartDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <h1 style={{ margin: 0, color: "var(--text-primary)" }}>
            Your Study Plan
          </h1>
          <button
            onClick={() => {
              setEditTargetPercentile(user?.targetPercentile || "95+");
              if (user?.examDate) setEditDate(user.examDate);
              if (user?.startDate)
                setEditStartDate(user.startDate.split("T")[0]);
              setShowEditModal(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(99, 102, 241, 0.2)", // Highlighted background
              border: "1px solid rgba(99, 102, 241, 0.3)",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-button-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg-button)")
            }
          >
            <Edit2 size={16} /> Edit Plan
          </button>
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

      {/* Plan Stats Badges */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: "var(--bg-glass)",
            border: "var(--glass-border)",
            padding: "8px 14px",
            borderRadius: "20px",
            color: "var(--text-secondary)",
            fontSize: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Target size={16} color="#c084fc" /> Target:{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {user?.targetPercentile || "95+"} %ile
          </strong>
        </span>
        <span
          style={{
            background: "var(--bg-glass)",
            border: "var(--glass-border)",
            padding: "8px 14px",
            borderRadius: "20px",
            color: "var(--text-secondary)",
            fontSize: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Calendar size={16} color="#2dd4bf" /> Plan Duration:{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {plan?.length || 0} Days
          </strong>
        </span>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {plan.map((day, index) => {
          const isCurrentDay = isToday(day.date);
          const isPastDay =
            new Date(day.date).setHours(0, 0, 0, 0) <
            new Date().setHours(0, 0, 0, 0);

          return (
            <div ref={(el) => (dayRefs.current[index] = el)} key={index}>
              <GlassCard
                style={{
                  padding: "0",
                  background: isCurrentDay
                    ? "rgba(99, 102, 241, 0.05)"
                    : "var(--bg-card)",
                  border: isCurrentDay
                    ? "1px solid rgba(99, 102, 241, 0.5)"
                    : "var(--glass-border)",
                  boxShadow: isCurrentDay
                    ? "0 4px 20px rgba(99, 102, 241, 0.15)"
                    : "none",
                  opacity:
                    isPastDay &&
                    !isCurrentDay &&
                    day.tasks.every((t) => t.completed)
                      ? 0.6
                      : isPastDay && !isCurrentDay
                        ? 0.8
                        : 1,
                  filter:
                    isPastDay && !isCurrentDay ? "grayscale(40%)" : "none",
                  transition: "opacity 0.3s, filter 0.3s",
                }}
              >
                <div
                  onClick={() => toggleDay(index)}
                  style={{
                    padding: "20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: day.isRevision
                      ? "rgba(251, 146, 60, 0.1)"
                      : isCurrentDay
                        ? "rgba(99, 102, 241, 0.1)"
                        : "transparent",
                    borderBottom:
                      expandedDay === index
                        ? "1px solid var(--glass-border)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: isCurrentDay
                          ? "var(--primary-gradient)"
                          : "var(--bg-button)",
                        border: isCurrentDay ? "none" : "var(--glass-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: isCurrentDay ? "white" : "var(--text-primary)",
                      }}
                    >
                      {day.day}
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "var(--text-primary)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {day.isRevision
                          ? day.tasks[0].topic
                          : new Date(day.date).toDateString()}
                        {isCurrentDay && (
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              background: "var(--primary-gradient)",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            TODAY
                          </span>
                        )}
                      </h3>
                      {!day.isRevision && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {day.tasks.filter((t) => t.completed).length}/
                          {day.tasks.length} Completed
                        </p>
                      )}
                    </div>
                  </div>
                  {expandedDay === index ? (
                    <div
                      style={{
                        padding: "4px",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "var(--glass-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronUp color="var(--text-primary)" size={20} />
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "4px",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "var(--glass-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronDown color="var(--text-primary)" size={20} />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {expandedDay === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "20px" }}>
                        {day.tasks.map((task) => (
                          <div key={task.id} style={{ marginBottom: "8px" }}>
                            <div
                              onClick={() => markTaskComplete(index, task.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px",
                                borderRadius: "8px",
                                background: "var(--bg-glass)",
                                border: "var(--glass-border)",
                                cursor: "pointer",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                {task.completed ? (
                                  <CheckCircle color="#4ade80" size={20} />
                                ) : (
                                  <Circle
                                    color="var(--text-secondary)"
                                    size={20}
                                  />
                                )}
                                <span
                                  style={{
                                    textDecoration: task.completed
                                      ? "line-through"
                                      : "none",
                                    color: task.completed
                                      ? "var(--text-secondary)"
                                      : "var(--text-primary)",
                                  }}
                                >
                                  {task.topic}{" "}
                                  <span
                                    style={{ fontSize: "12px", opacity: 0.7 }}
                                  >
                                    ({task.subject})
                                  </span>
                                </span>
                              </div>

                              {task.subtopics && (
                                <div
                                  onClick={(e) => toggleTask(e, task.id)}
                                  style={{
                                    padding: "4px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    background: "var(--bg-button)",
                                    border: "var(--glass-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {expandedTask === task.id ? (
                                    <ChevronUp
                                      size={16}
                                      color="var(--text-primary)"
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={16}
                                      color="var(--text-primary)"
                                    />
                                  )}
                                </div>
                              )}
                            </div>

                            <AnimatePresence>
                              {expandedTask === task.id && task.subtopics && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  style={{
                                    overflow: "hidden",
                                    paddingLeft: "44px",
                                    paddingRight: "12px",
                                  }}
                                >
                                  <ul
                                    style={{
                                      margin: "8px 0",
                                      paddingLeft: "0",
                                      listStyle: "none",
                                      color: "var(--text-secondary)",
                                      fontSize: "14px",
                                      background: "var(--bg-glass)",
                                      borderRadius: "8px",
                                      padding: "12px",
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
                                          padding: "0px 0 0px 0px",
                                          borderRadius: "0 8px 8px 0",
                                          transition: "all 0.2s",
                                          borderLeft:
                                            "2px solid var(--glass-border)",
                                          background: "transparent",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSubtopic(index, task.id, idx);
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background =
                                            "rgba(255,255,255,0.03)";
                                          e.currentTarget.style.borderLeft =
                                            "5px solid var(--text-accent)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background =
                                            "transparent";
                                          e.currentTarget.style.borderLeft =
                                            "2px solid var(--glass-border)";
                                        }}
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
                                            textDecoration: sub.completed
                                              ? "line-through"
                                              : "none",
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
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(5px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "var(--bg-card)",
                padding: "32px",
                borderRadius: "24px",
                border: "var(--glass-border)",
                width: "90%",
                maxWidth: "500px",
                boxShadow: "var(--glass-shadow)",
                position: "relative",
              }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                <X size={24} />
              </button>

              <h2 style={{ marginBottom: "8px", color: "var(--text-primary)" }}>
                Edit Study Plan
              </h2>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "var(--text-primary)",
                  }}
                >
                  Target Percentile:
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={editTargetPercentile}
                    onChange={(e) => setEditTargetPercentile(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      background: "var(--bg-glass)",
                      border: "var(--glass-border)",
                      color: "var(--text-primary)",
                      fontSize: "16px",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option
                      value="99+"
                      style={{ background: "#1e293b", color: "#f8fafc" }}
                    >
                      99+ %ile (Top Tier IIMs)
                    </option>
                    <option
                      value="95+"
                      style={{ background: "#1e293b", color: "#f8fafc" }}
                    >
                      95-99 %ile (New IIMs / Top Non-IIMs)
                    </option>
                    <option
                      value="90+"
                      style={{ background: "#1e293b", color: "#f8fafc" }}
                    >
                      90-95 %ile (Good MBA Colleges)
                    </option>
                    <option
                      value="80+"
                      style={{ background: "#1e293b", color: "#f8fafc" }}
                    >
                      80-90 %ile (Decent MBA Colleges)
                    </option>
                  </select>
                  <Target
                    size={18}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-secondary)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              <p
                style={{
                  marginBottom: "24px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                Choose a new duration. This will regenerate your daily tasks.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {[3, 6, 9, 12].map((m) => {
                  const isActive = (() => {
                    if (!editStartDate || !editDate) return false;
                    const s = new Date(editStartDate);
                    const e = new Date(editDate);
                    const expectedE = new Date(s);
                    expectedE.setMonth(expectedE.getMonth() + m);
                    return Math.abs(e - expectedE) <= 1000 * 60 * 60 * 24 * 5;
                  })();

                  return (
                    <button
                      key={m}
                      onClick={() => handleDurationSelect(m)}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        background: isActive
                          ? "var(--primary-gradient)"
                          : "var(--bg-button)",
                        border: isActive
                          ? "1px solid rgba(99, 102, 241, 0.5)"
                          : "var(--glass-border)",
                        color: isActive ? "white" : "var(--text-primary)",
                        boxShadow: isActive
                          ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                          : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background =
                            "var(--bg-button-hover)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "var(--bg-button)";
                      }}
                    >
                      <Clock size={16} /> {m} Months
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  textAlign: "center",
                  margin: "16px 0",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                OR Customize
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                    }}
                  >
                    Start Date:
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        background: "var(--bg-glass)",
                        border: "var(--glass-border)",
                        color: "var(--text-primary)",
                        fontSize: "16px",
                      }}
                    />
                    <Calendar
                      size={18}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                    }}
                  >
                    Exam Date:
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        background: "var(--bg-glass)",
                        border: "var(--glass-border)",
                        color: "var(--text-primary)",
                        fontSize: "16px",
                      }}
                    />
                    <Calendar
                      size={18}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {dateError && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    fontSize: "13px",
                    fontWeight: 500,
                    marginBottom: "16px",
                  }}
                >
                  ⚠️ {dateError}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "none",
                    background: "transparent",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={savePlanChanges}
                  disabled={!editDate || !editStartDate}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "none",
                    background:
                      editDate && editStartDate
                        ? "var(--primary-gradient)"
                        : "var(--bg-button)",
                    color:
                      editDate && editStartDate
                        ? "white"
                        : "var(--text-secondary)",
                    cursor:
                      editDate && editStartDate ? "pointer" : "not-allowed",
                    fontWeight: 600,
                    opacity: editDate && editStartDate ? 1 : 0.7,
                    boxShadow:
                      editDate && editStartDate
                        ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                        : "none",
                  }}
                >
                  Update Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Consistency Celebration Toast */}
      <AnimatePresence>
        {showConsistencyToast && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: "40px",
              right: "40px",
              background: "var(--bg-glass)",
              border: "1px solid rgba(45, 212, 191, 0.3)", // Teal hint
              padding: "20px 24px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 8px 32px rgba(45, 212, 191, 0.2)",
              zIndex: 1000,
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #14b8a6, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Trophy size={24} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "var(--text-primary)",
                  fontSize: "16px",
                }}
              >
                Daily Goal Complete!
              </h3>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                You're on a{" "}
                <strong style={{ color: "#2dd4bf" }}>
                  {currentStreak} Day
                </strong>{" "}
                streak. Keep it up!
              </p>
            </div>
            <button
              onClick={() => setShowConsistencyToast(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: "8px",
                marginLeft: "8px",
              }}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyPlan;
