import React, { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";
import { Clock, Calendar, Target } from "lucide-react";
import { usePageSEO } from "../hooks/usePageSEO";

const Onboarding = () => {
  usePageSEO(
    "Get Started",
    "Set up your personalized CAT exam preparation plan. Choose your target percentile, exam date, and start date to generate an AI-powered study schedule.",
  );
  const navigate = useNavigate();
  const { startPrep } = useStudy();
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [targetPercentile, setTargetPercentile] = useState("95+");
  const [dateError, setDateError] = useState("");

  const handleDurationSelect = (months) => {
    const today = new Date();
    const targetDate = new Date(today.setMonth(today.getMonth() + months));
    setExamDate(targetDate.toISOString().split("T")[0]);
    setDateError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && examDate && startDate) {
      const s = new Date(startDate);
      const ex = new Date(examDate);
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
      startPrep(name, examDate, new Date(startDate), targetPercentile);
      navigate("/catprep");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <GlassCard
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "32px",
          borderRadius: "24px",
          background: "var(--bg-card)",
          border: "var(--glass-border)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "8px",
            color: "var(--text-primary)",
          }}
        >
          Welcome to CAT Prep
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "32px",
            color: "var(--text-secondary)",
          }}
        >
          Let's create your personalized study plan.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--text-primary)",
              }}
            >
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "var(--bg-glass)",
                border: "var(--glass-border)",
                color: "var(--text-primary)",
                fontSize: "16px",
              }}
              required
            />
          </div>

          <div>
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
                value={targetPercentile}
                onChange={(e) => setTargetPercentile(e.target.value)}
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

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--text-primary)",
              }}
            >
              Choose a duration. This will set your daily study plan.
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {[3, 6, 9, 12].map((m) => {
                const isActive = (() => {
                  if (!startDate || !examDate) return false;
                  const s = new Date(startDate);
                  const e = new Date(examDate);
                  const expectedE = new Date(s);
                  expectedE.setMonth(expectedE.getMonth() + m);
                  return Math.abs(e - expectedE) <= 1000 * 60 * 60 * 24 * 5;
                })();

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      handleDurationSelect(m);
                    }}
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
                margin: "12px 0",
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
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "var(--text-primary)",
                  }}
                >
                  Start Date:
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "var(--bg-glass)",
                      border: "var(--glass-border)",
                      color: "var(--text-primary)",
                      fontSize: "16px",
                    }}
                    required
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
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "var(--bg-glass)",
                      border: "var(--glass-border)",
                      color: "var(--text-primary)",
                      fontSize: "16px",
                    }}
                    required
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
              }}
            >
              ⚠️ {dateError}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background: "var(--primary-gradient)",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              marginTop: "16px",
              cursor: "pointer",
            }}
          >
            Create My Plan
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Onboarding;
