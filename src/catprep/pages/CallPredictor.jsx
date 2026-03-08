import React, { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import PomodoroHeaderTimer from "../components/PomodoroHeaderTimer";
import {
  Target,
  GraduationCap,
  Briefcase,
  School,
  ChevronDown,
  Calculator,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronUp,
  Clock,
  Calendar,
  X,
} from "lucide-react";
import {
  predictCalls,
  getProfileStrength,
  getRequiredPercentiles,
} from "../utils/callPredictorEngine";
import { usePageSEO } from "../hooks/usePageSEO";
import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";
import { motion, AnimatePresence } from "framer-motion";

// Reusable styled components
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  background: "var(--bg-glass)",
  border: "var(--glass-border)",
  color: "var(--text-primary)",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const selectWrapperStyle = {
  position: "relative",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
  paddingRight: "36px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "var(--text-secondary)",
  fontSize: "13px",
  fontWeight: 500,
};

const sectionTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "16px",
  paddingBottom: "8px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const chevronIcon = (
  <ChevronDown
    size={16}
    style={{
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--text-secondary)",
      pointerEvents: "none",
    }}
  />
);

// Stable component: defined outside CallPredictor to avoid re-mount on every render
const FieldSelect = ({ label, field, value, onChange, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={selectWrapperStyle}>
      <select
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        style={selectStyle}
      >
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            style={{ background: "#1e293b", color: "#f8fafc" }}
          >
            {opt}
          </option>
        ))}
      </select>
      {chevronIcon}
    </div>
  </div>
);

// Stable component: defined outside CallPredictor to avoid re-mount on every render
const FieldInput = ({
  label,
  field,
  value,
  onChange,
  onBlur,
  placeholder,
  hint,
  error,
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        // Allow only digits and a single dot (for decimals like 97.5)
        if (val === "" || /^\d*\.?\d*$/.test(val)) {
          onChange(field, val);
        }
      }}
      onBlur={() => onBlur && onBlur(field)}
      placeholder={placeholder}
      style={{
        ...inputStyle,
        ...(error ? { borderColor: "rgba(239, 68, 68, 0.5)" } : {}),
      }}
      autoComplete="off"
    />
    {error ? (
      <span
        style={{
          fontSize: "11px",
          color: "#f87171",
          marginTop: "4px",
          display: "block",
        }}
      >
        {error}
      </span>
    ) : hint ? (
      <span
        style={{
          fontSize: "11px",
          color: "var(--text-secondary)",
          opacity: 0.7,
          marginTop: "4px",
          display: "block",
        }}
      >
        {hint}
      </span>
    ) : null}
  </div>
);

const getDifficultyProps = (percentileStr) => {
  const p = parseFloat(percentileStr);
  if (isNaN(p))
    return {
      level: "N/A",
      word: "Keep pushing!",
      color: "var(--text-secondary)",
    };
  if (p >= 99.5)
    return {
      level: "Extreme",
      word: "Only top 0.5% make it. Be extraordinary!",
      color: "#f43f5e",
    };
  if (p >= 99.0)
    return {
      level: "Very Hard",
      word: "Requires relentless dedication.",
      color: "#f97316",
    };
  if (p >= 95.0)
    return {
      level: "Hard",
      word: "Challenging but possible. Grind daily!",
      color: "#fb923c",
    };
  if (p >= 90.0)
    return {
      level: "Moderate",
      word: "A solid plan gets you there.",
      color: "#2dd4bf",
    };
  return {
    level: "Achievable",
    word: "Well within reach. Keep up!",
    color: "#4ade80",
  };
};

const CallPredictor = () => {
  usePageSEO(
    "IIM Call Predictor",
    "Predict your IIM and B-school shortlist chances based on CAT percentile, academics, work experience, and category. Uses real admission criteria and cutoff data for 45+ institutes.",
  );
  const navigate = useNavigate();
  const { user, startPrep } = useStudy();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("callPredictorData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore JSON error
      }
    }
    return {
      catPercentile: "",
      catVARC: "",
      catDILR: "",
      catQA: "",
      category: "General",
      gender: "Male",
      pwd: "No",
      board10: "CBSE",
      marks10: "",
      board12: "CBSE",
      stream12: "Science",
      marks12: "",
      gradStream: "B.Tech/B.E.",
      gradPercent: "",
      workExpMonths: "",
      nirfRank: "",
      isIIT: "No",
      profQual: "None",
      extracurricular: "0",
      hasPostGrad: "No",
      postGradType: "",
    };
  });

  // Save to local storage whenever form changes
  React.useEffect(() => {
    localStorage.setItem("callPredictorData", JSON.stringify(form));
  }, [form]);

  const [results, setResults] = useState(null);
  const [profileStrength, setProfileStrength] = useState(null);
  const [expandedInstitute, setExpandedInstitute] = useState(null);
  const [showSectional, setShowSectional] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [activeTab, setActiveTab] = useState("past");

  // Duration Modal State
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedTargetPercentile, setSelectedTargetPercentile] =
    useState(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [examDate, setExamDate] = useState("");
  const [dateError, setDateError] = useState("");

  const handleQuickDuration = (months) => {
    const today = new Date();
    const targetDate = new Date(today.setMonth(today.getMonth() + months));
    const exDate = targetDate.toISOString().split("T")[0];
    const targetPct = `${Math.floor(parseFloat(selectedTargetPercentile))}+`;
    startPrep(user?.name || "Student", exDate, new Date(), targetPct);
    setShowDurationModal(false);
    navigate("/catprep");
  };

  const handleCreatePlan = () => {
    if (examDate && startDate) {
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
        setDateError("Plan must be at least 30 days. CAT prep needs time!");
        return;
      }
      setDateError("");
      const targetPct = `${Math.floor(parseFloat(selectedTargetPercentile))}+`;
      startPrep(
        user?.name || "Student",
        examDate,
        new Date(startDate),
        targetPct,
      );
      setShowDurationModal(false);
      navigate("/catprep");
    }
  };

  // Valid ranges for numeric fields
  const numericRanges = {
    catPercentile: [0, 100, "Percentile must be 0-100"],
    catVARC: [0, 100, "Percentile must be 0-100"],
    catDILR: [0, 100, "Percentile must be 0-100"],
    catQA: [0, 100, "Percentile must be 0-100"],
    marks10: [0, 100, "Marks must be 0-100"],
    marks12: [0, 100, "Marks must be 0-100"],
    gradPercent: [0, 100, "Percentage must be 0-100"],
    workExpMonths: [0, 240, "Max 240 months (20 years)"],
    nirfRank: [1, 200, "Rank must be 1-200"],
  };

  // Allow free typing, but validate and show/clear inline hints
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError("");

    // Validate and show/clear field error
    if (numericRanges[field] && value !== "") {
      const num = parseFloat(value);
      const [min, max, msg] = numericRanges[field];
      if (!isNaN(num) && (num < min || num > max)) {
        setFieldErrors((prev) => ({ ...prev, [field]: msg }));
      } else {
        setFieldErrors((prev) => {
          const n = { ...prev };
          delete n[field];
          return n;
        });
      }
    } else {
      setFieldErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  // On blur: clamp to valid range silently (only if the current value is a valid number)
  const handleBlur = (field) => {
    if (numericRanges[field] && form[field] !== "") {
      const num = parseFloat(form[field]);
      if (!isNaN(num)) {
        const [min, max] = numericRanges[field];
        if (num < min || num > max) {
          const clamped = Math.min(max, Math.max(min, num));
          setForm((prev) => ({ ...prev, [field]: String(clamped) }));
          setFieldErrors((prev) => {
            const n = { ...prev };
            delete n[field];
            return n;
          });
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "past") {
      const pctile = parseFloat(form.catPercentile);
      if (!pctile || pctile <= 0) {
        setFormError("Please enter your CAT percentile to predict calls.");
        return;
      }
    }
    setFormError("");

    if (activeTab === "past") {
      const predictions = predictCalls(form);
      const strength = getProfileStrength(form, false);
      setResults(predictions);
      setProfileStrength(strength);
    } else {
      const predictions = getRequiredPercentiles(form);
      const strength = getProfileStrength(form, true);
      setResults(predictions);
      setProfileStrength(strength);
    }
  };

  // Profile Strength Card
  const ProfileStrengthCard = () => {
    if (!profileStrength) return null;

    const strengthColor =
      profileStrength.score >= 85
        ? "#22c55e"
        : profileStrength.score >= 72
          ? "#2dd4bf"
          : profileStrength.score >= 58
            ? "#fb923c"
            : profileStrength.score >= 40
              ? "#f97316"
              : "#f43f5e";

    const factorBar = (label, value, maxVal = 100) => {
      const pct = Math.min(100, Math.round((value / maxVal) * 100));
      return (
        <div style={{ marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>{label}</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {value}
            </span>
          </div>
          <div
            style={{
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: "3px",
                background: `linear-gradient(90deg, ${strengthColor}88, ${strengthColor})`,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <GlassCard>
        <div style={sectionTitleStyle}>
          <BarChart3 size={20} color={strengthColor} /> Profile Strength
          Assessment
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          {/* Circular score indicator */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: `4px solid ${strengthColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: `${strengthColor}10`,
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: strengthColor,
                lineHeight: 1,
              }}
            >
              {profileStrength.score}
            </span>
            <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              / 100
            </span>
          </div>

          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: strengthColor,
                marginBottom: "4px",
              }}
            >
              {profileStrength.label}
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {profileStrength.description}
            </p>
          </div>
        </div>

        {/* Factor breakdown */}
        {!profileStrength.isFutureTab &&
          factorBar("CAT Percentile", profileStrength.factors.catPercentile)}
        {factorBar("Academics (Avg)", profileStrength.factors.academics)}
        {factorBar("Work Experience", profileStrength.factors.workExperience)}
        {factorBar(
          "Diversity Bonuses",
          profileStrength.factors.diversityBonuses,
          15,
        )}
      </GlassCard>
    );
  };

  // Result row with expandable breakdown
  const ResultRow = ({ r, idx }) => {
    const isExpanded = expandedInstitute === r.institute;

    const ProbIcon = () => {
      if (r.probability.level === "Below Cutoff")
        return <XCircle size={14} color={r.probability.color} />;
      if (r.probability.level === "Sectional Fail")
        return <AlertTriangle size={14} color={r.probability.color} />;
      if (r.probability.level === "Very High" || r.probability.level === "High")
        return <CheckCircle2 size={14} color={r.probability.color} />;
      return <TrendingUp size={14} color={r.probability.color} />;
    };

    return (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 0.8fr 1fr 1fr",
            padding: "14px 20px",
            borderBottom:
              isExpanded || idx < results.length - 1
                ? "1px solid rgba(255,255,255,0.04)"
                : "none",
            background:
              idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
            cursor: "pointer",
            transition: "background 0.2s",
            alignItems: "center",
          }}
          onClick={() => setExpandedInstitute(isExpanded ? null : r.institute)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)")
          }
        >
          {/* Institute name + tier */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
              {r.institute}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                opacity: 0.7,
              }}
            >
              {r.tier}
            </span>
          </div>

          {/* Min Cutoff */}
          <span
            style={{
              textAlign: "center",
              color: r.meetsMinimum ? "var(--text-secondary)" : "#f43f5e",
              fontSize: "13px",
              fontWeight: r.meetsMinimum ? 400 : 600,
            }}
          >
            {r.minCutoff}%ile
          </span>

          {/* Composite Score vs Threshold */}
          <span
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "var(--text-primary)",
            }}
          >
            <span style={{ fontWeight: 600 }}>{r.compositeScore}</span>
            <span style={{ color: "var(--text-secondary)", margin: "0 3px" }}>
              /
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              {r.threshold}
            </span>
          </span>

          {/* Chance level */}
          <span
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: 600,
                color: r.probability.color,
                background: `${r.probability.color}15`,
                border: `1px solid ${r.probability.color}30`,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ProbIcon />
              {r.probability.level}
            </span>
            {isExpanded ? (
              <ChevronUp size={14} color="var(--text-secondary)" />
            ) : (
              <ChevronDown size={14} color="var(--text-secondary)" />
            )}
          </span>
        </div>

        {/* Expanded breakdown */}
        {isExpanded && (
          <div
            style={{
              padding: "16px 24px",
              background: "rgba(99, 102, 241, 0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {!r.meetsMinimum && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "rgba(244, 63, 94, 0.1)",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  fontSize: "13px",
                  color: "#f43f5e",
                }}
              >
                <XCircle size={16} />
                Your CAT percentile ({form.catPercentile || 0}) is below the
                minimum qualifying cutoff ({r.minCutoff}%ile for {r.category}).
              </div>
            )}
            {r.meetsMinimum && !r.meetsSectional && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "rgba(251, 146, 60, 0.1)",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  fontSize: "13px",
                  color: "#fb923c",
                }}
              >
                <AlertTriangle size={16} />
                Sectional cutoff not met: {r.sectionalNote}
              </div>
            )}

            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Score Breakdown
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
            >
              {[
                {
                  label: "CAT Score",
                  val: r.breakdown.cat.weighted,
                  wt: `${(r.breakdown.cat.weight * 100).toFixed(0)}%`,
                },
                {
                  label: "10th Marks",
                  val: r.breakdown.tenth.weighted,
                  wt: `${(r.breakdown.tenth.weight * 100).toFixed(0)}%`,
                },
                {
                  label: "12th Marks",
                  val: r.breakdown.twelfth.weighted,
                  wt: `${(r.breakdown.twelfth.weight * 100).toFixed(0)}%`,
                },
                {
                  label: "Graduation",
                  val: r.breakdown.graduation.weighted,
                  wt: `${(r.breakdown.graduation.weight * 100).toFixed(0)}%`,
                },
                {
                  label: "Work Exp",
                  val: r.breakdown.workExp.weighted,
                  wt: `${(r.breakdown.workExp.weight * 100).toFixed(0)}%`,
                },
                {
                  label: "Gender Div.",
                  val: r.breakdown.genderDiversity.weighted,
                  wt: `${(r.breakdown.genderDiversity.weight * 100).toFixed(0)}%`,
                },
                {
                  label: "Acad. Div.",
                  val: r.breakdown.academicDiversity.weighted,
                  wt: `${(r.breakdown.academicDiversity.weight * 100).toFixed(0)}%`,
                },
              ]
                .filter((x) => parseFloat(x.wt) > 0)
                .map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                        marginBottom: "4px",
                      }}
                    >
                      {item.label}{" "}
                      <span style={{ opacity: 0.5 }}>({item.wt})</span>
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.val}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const RequiredRankRow = ({ r, idx }) => {
    const isExpanded = expandedInstitute === r.institute;
    const difficulty = getDifficultyProps(r.requiredPercentile);

    return (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 0.8fr 1fr 1.2fr 1.2fr",
            padding: "14px 20px",
            borderBottom:
              isExpanded || idx < results.length - 1
                ? "1px solid rgba(255,255,255,0.04)"
                : "none",
            background:
              idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
            cursor: "pointer",
            transition: "background 0.2s",
            alignItems: "center",
          }}
          onClick={() => setExpandedInstitute(isExpanded ? null : r.institute)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(99, 102, 241, 0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)")
          }
        >
          {/* Institute name + tier */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
              {r.institute}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                opacity: 0.7,
              }}
            >
              {r.tier}
            </span>
          </div>

          {/* Min Cutoff */}
          <span
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "13px",
            }}
          >
            {r.minCutoff}%ile
          </span>

          {/* Target Percentile */}
          <span
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontWeight: 600,
            }}
          >
            {r.requiredPercentile}%ile
          </span>

          {/* Difficulty */}
          <span
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: r.achievable ? difficulty.color : "#f43f5e",
              }}
            >
              {r.achievable ? difficulty.level : "Impossible"}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--text-secondary)",
                lineHeight: "1.2",
                maxWidth: "120px",
                textAlign: "center",
              }}
            >
              {r.achievable ? difficulty.word : "Profile Bottleneck"}
            </span>
          </span>

          {/* Action Button / Note */}
          <span
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            {r.achievable && r.requiredPercentile !== "100.00" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTargetPercentile(r.requiredPercentile);
                  setShowDurationModal(true);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "white",
                  background: "var(--primary-gradient)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
              >
                Follow This Plan
              </button>
            ) : (
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: r.color,
                  background: `${r.color}15`,
                  border: `1px solid ${r.color}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100px", // give it some limit
                }}
                title={r.note}
              >
                {r.note}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp size={14} color="var(--text-secondary)" />
            ) : (
              <ChevronDown size={14} color="var(--text-secondary)" />
            )}
          </span>
        </div>

        {/* Expanded breakdown */}
        {isExpanded && (
          <div
            style={{
              padding: "16px 24px",
              background: "rgba(99, 102, 241, 0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {!r.achievable && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "rgba(244, 63, 94, 0.1)",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  fontSize: "13px",
                  color: "#f43f5e",
                }}
              >
                <XCircle size={16} />
                Profile Bottleneck: Even with 100%ile, you cannot reach the
                historical threshold.
              </div>
            )}

            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Requirements Breakdown
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  Safe Threshold
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {r.breakdown.historicalThreshold}
                </div>
              </div>
              <div
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: "rgba(249, 115, 22, 0.05)",
                  border: "1px solid rgba(249, 115, 22, 0.15)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  Target (Borderline)
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#f97316",
                  }}
                >
                  {r.breakdown.targetThreshold}
                </div>
              </div>
              <div
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  Your Non-CAT Setup
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {r.breakdown.nonCatComponentSum}
                </div>
              </div>
              <div
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  CAT Weight
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {(r.breakdown.catWeight * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Count results by tier
  const getCallSummary = () => {
    if (!results || activeTab === "future") return null;
    const eligible = results.filter(
      (r) =>
        r.meetsMinimum &&
        r.meetsSectional &&
        (r.probability.level === "Very High" ||
          r.probability.level === "High" ||
          r.probability.level === "Moderate"),
    );
    const veryHigh = eligible.filter(
      (r) => r.probability.level === "Very High",
    ).length;
    const high = eligible.filter((r) => r.probability.level === "High").length;
    const moderate = eligible.filter(
      (r) => r.probability.level === "Moderate",
    ).length;

    return { total: eligible.length, veryHigh, high, moderate };
  };

  const summary = getCallSummary();

  return (
    <div>
      {/* new row  */}
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
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1 style={{ margin: "0 0 8px 0" }}>CAT Call Predictor</h1>
          <p style={{ margin: 0 }}>
            Predict which IIMs and top B-schools may shortlist you based on your
            CAT percentile, academic profile, work experience, and reservation
            category. Uses real admission criteria weights and cutoff data.
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

      <div style={{ maxWidth: "860px" }}>
        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            background: "var(--bg-glass)",
            padding: "6px",
            borderRadius: "12px",
            border: "var(--glass-border)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab("past");
              setResults(null);
              setProfileStrength(null);
              setExpandedInstitute(null);
            }}
            style={{
              flex: 1,
              padding: "12px",
              background:
                activeTab === "past"
                  ? "rgba(99, 102, 241, 0.15)"
                  : "transparent",
              color: activeTab === "past" ? "#818cf8" : "var(--text-secondary)",
              border:
                activeTab === "past"
                  ? "1px solid rgba(99, 102, 241, 0.3)"
                  : "1px solid transparent",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Past / CAT 2025
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("future");
              setResults(null);
              setProfileStrength(null);
              setExpandedInstitute(null);
            }}
            style={{
              flex: 1,
              padding: "12px",
              background:
                activeTab === "future"
                  ? "rgba(99, 102, 241, 0.15)"
                  : "transparent",
              color:
                activeTab === "future" ? "#818cf8" : "var(--text-secondary)",
              border:
                activeTab === "future"
                  ? "1px solid rgba(99, 102, 241, 0.3)"
                  : "1px solid transparent",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            CAT 2026 / Profile Target
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* CAT Score — THE most important input */}
          {activeTab === "past" && (
            <GlassCard
              style={{
                padding: "28px",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))",
              }}
            >
              <div style={sectionTitleStyle}>
                <Calculator size={20} color="#818cf8" /> CAT Score{" "}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#818cf8",
                    fontWeight: 400,
                    marginLeft: "auto",
                    background: "rgba(99,102,241,0.15)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  Most Important (55-70% weight)
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "16px",
                }}
              >
                <FieldInput
                  label="Overall CAT Percentile"
                  field="catPercentile"
                  value={form.catPercentile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={fieldErrors.catPercentile}
                  placeholder="e.g. 97.5"
                  hint="This is the single most important factor. Enter your actual or expected percentile."
                />
              </div>

              {/* Toggle sectional scores */}
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "#818cf8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => setShowSectional(!showSectional)}
              >
                {showSectional ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
                {showSectional ? "Hide" : "Add"} Sectional Percentiles
                (Optional)
              </div>
              {showSectional && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "16px",
                    marginTop: "12px",
                  }}
                >
                  <FieldInput
                    label="VARC Percentile"
                    field="catVARC"
                    value={form.catVARC}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.catVARC}
                    placeholder="e.g. 95"
                    hint="Verbal Ability & Reading Comprehension"
                  />
                  <FieldInput
                    label="DILR Percentile"
                    field="catDILR"
                    value={form.catDILR}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.catDILR}
                    placeholder="e.g. 92"
                    hint="Data Interpretation & Logical Reasoning"
                  />
                  <FieldInput
                    label="QA Percentile"
                    field="catQA"
                    value={form.catQA}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.catQA}
                    placeholder="e.g. 98"
                    hint="Quantitative Ability"
                  />
                </div>
              )}
            </GlassCard>
          )}

          {/* Personal Details */}
          <GlassCard>
            <div style={sectionTitleStyle}>
              <Target size={20} color="#c084fc" /> Personal Details
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              <FieldSelect
                label="Category"
                field="category"
                value={form.category}
                onChange={handleChange}
                options={["General", "OBC", "SC", "ST", "EWS"]}
              />
              <FieldSelect
                label="Gender"
                field="gender"
                value={form.gender}
                onChange={handleChange}
                options={["Male", "Female", "Transgender"]}
              />
              <FieldSelect
                label="PwD"
                field="pwd"
                value={form.pwd}
                onChange={handleChange}
                options={["No", "Yes"]}
              />
            </div>

            {form.gender !== "Male" && (
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#2dd4bf",
                  padding: "6px 10px",
                  background: "rgba(45, 212, 191, 0.08)",
                  borderRadius: "6px",
                }}
              >
                <Info size={14} />
                Gender diversity bonus applies at IIM-B (+5%), IIM-C (+4%), FMS
                (+5 marks), and other institutes.
              </div>
            )}
            {form.pwd === "Yes" && (
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#818cf8",
                  padding: "6px 10px",
                  background: "rgba(129, 140, 248, 0.08)",
                  borderRadius: "6px",
                }}
              >
                <Info size={14} />
                PwD candidates get significantly relaxed cutoffs and thresholds.
              </div>
            )}
          </GlassCard>

          {/* Class 10th */}
          <GlassCard>
            <div style={sectionTitleStyle}>
              <School size={20} color="#38bdf8" /> Class 10th Details
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <FieldSelect
                label="Board"
                field="board10"
                value={form.board10}
                onChange={handleChange}
                options={["CBSE", "ICSE", "State Board", "IB", "Other"]}
              />
              <FieldInput
                label="Percentage"
                field="marks10"
                value={form.marks10}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.marks10}
                placeholder="e.g. 92.5"
                hint="5-12% weight at most IIMs"
              />
            </div>
          </GlassCard>

          {/* Class 12th */}
          <GlassCard>
            <div style={sectionTitleStyle}>
              <School size={20} color="#2dd4bf" /> Class 12th Details
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              <FieldSelect
                label="Board"
                field="board12"
                value={form.board12}
                onChange={handleChange}
                options={["CBSE", "ICSE", "State Board", "IB", "Other"]}
              />
              <FieldSelect
                label="Stream"
                field="stream12"
                value={form.stream12}
                onChange={handleChange}
                options={["Science", "Commerce", "Arts/Humanities"]}
              />
              <FieldInput
                label="Percentage"
                field="marks12"
                value={form.marks12}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.marks12}
                placeholder="e.g. 88.0"
                hint="10-15% weight at most IIMs"
              />
            </div>
          </GlassCard>

          {/* Graduation */}
          <GlassCard>
            <div style={sectionTitleStyle}>
              <GraduationCap size={20} color="#fb923c" /> Graduation Details
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <FieldSelect
                label="Graduation Stream"
                field="gradStream"
                value={form.gradStream}
                onChange={handleChange}
                options={[
                  "B.Tech/B.E.",
                  "B.Com",
                  "B.Com (Hons)",
                  "BA",
                  "BA (Hons Eco)",
                  "BSc",
                  "BBA/BMS",
                  "BFIA",
                  "B.Pharm",
                  "LLB",
                  "MBBS",
                  "CA (Integrated)",
                  "Other",
                ]}
              />
              <FieldInput
                label="Percentage / CGPA (out of 100)"
                field="gradPercent"
                value={form.gradPercent}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.gradPercent}
                placeholder="e.g. 78.5"
                hint="5-10% weight at most IIMs"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <FieldInput
                label="NIRF Rank of UG Institute (100 if unranked)"
                field="nirfRank"
                value={form.nirfRank}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.nirfRank}
                placeholder="e.g. 25"
              />
              <FieldSelect
                label="IIT / NIT / BITS?"
                field="isIIT"
                value={form.isIIT}
                onChange={handleChange}
                options={["No", "Yes"]}
              />
            </div>
            {!["B.Tech/B.E."].includes(form.gradStream) && (
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#fb923c",
                  padding: "6px 10px",
                  background: "rgba(251, 146, 60, 0.08)",
                  borderRadius: "6px",
                }}
              >
                <Info size={14} />
                Non-engineering background gives academic diversity bonus at
                IIM-C (+5%), MDI (+2.5%), IIFT (+4%), and others.
              </div>
            )}
          </GlassCard>

          {/* Work Experience & Professional */}
          <GlassCard>
            <div style={sectionTitleStyle}>
              <Briefcase size={20} color="#a78bfa" /> Work Experience &
              Qualifications
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              <FieldInput
                label="Work Experience (months)"
                field="workExpMonths"
                value={form.workExpMonths}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.workExpMonths}
                placeholder="e.g. 36"
                hint="Sweet spot: 24-36 months"
              />
              <FieldSelect
                label="Professional Qualification"
                field="profQual"
                value={form.profQual}
                onChange={handleChange}
                options={["None", "CA", "CS", "CMA/ICWA", "CFA", "FRM"]}
              />
              <FieldSelect
                label="Extracurricular Rating (0-5)"
                field="extracurricular"
                value={form.extracurricular}
                onChange={handleChange}
                options={["0", "1", "2", "3", "4", "5"]}
              />
            </div>

            {/* Post Graduation — conditional */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  form.hasPostGrad === "Yes" ? "1fr 1fr" : "1fr",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <FieldSelect
                label="Post Graduation?"
                field="hasPostGrad"
                value={form.hasPostGrad}
                onChange={handleChange}
                options={["No", "Yes"]}
              />
              {form.hasPostGrad === "Yes" && (
                <FieldSelect
                  label="Post Graduation Type"
                  field="postGradType"
                  value={form.postGradType}
                  onChange={handleChange}
                  options={[
                    "MA",
                    "MSc",
                    "M.Tech/M.E.",
                    "M.Com",
                    "MBA",
                    "MCA",
                    "LLM",
                    "M.Phil",
                    "PhD",
                    "Other",
                  ]}
                />
              )}
            </div>

            {form.hasPostGrad === "Yes" && (
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#a78bfa",
                  padding: "6px 10px",
                  background: "rgba(167, 139, 250, 0.08)",
                  borderRadius: "6px",
                }}
              >
                <Info size={14} />
                Post-graduation adds academic depth and diversity to your
                profile.
                {form.postGradType === "PhD" &&
                  " PhD holders get the highest bonus."}
                {form.postGradType === "MBA" &&
                  " Note: Having a prior MBA may reduce novelty for some IIMs."}
              </div>
            )}
          </GlassCard>

          {/* Submit */}
          {formError && (
            <div
              style={{
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertTriangle size={16} />
              {formError}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "var(--primary-gradient)",
              color: "white",
              border: "none",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(99, 102, 241, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(99, 102, 241, 0.3)";
            }}
          >
            {activeTab === "past" ? (
              <>
                <Calculator size={20} /> Predict My Calls
              </>
            ) : (
              <>
                <Target size={20} /> Calculate Target Percentile
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {results && (
          <div style={{ marginTop: "32px" }}>
            {/* Profile Strength */}
            <ProfileStrengthCard />

            {/* Summary stats */}
            {summary && (
              <GlassCard style={{ marginTop: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {summary.total}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Potential Calls
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#22c55e",
                      }}
                    >
                      {summary.veryHigh}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Very High
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#2dd4bf",
                      }}
                    >
                      {summary.high}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      High
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#fb923c",
                      }}
                    >
                      {summary.moderate}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Moderate
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Results Table */}
            <h2
              style={{
                marginTop: "24px",
                marginBottom: "16px",
                color: "var(--text-primary)",
              }}
            >
              Institute-wise Predictions
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Info size={14} />
              Click on any row to see your score breakdown for that institute.
              {activeTab === "past"
                ? " Score/Threshold shows your composite score vs the historical shortlisting threshold."
                : " Target percentiles represent the required CAT score to clear the borderline composite cutoff."}
            </p>

            <GlassCard style={{ padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    activeTab === "past"
                      ? "2fr 0.8fr 1fr 1fr"
                      : "2fr 0.8fr 1fr 1.2fr 1.2fr",
                  padding: "14px 20px",
                  background: "rgba(99, 102, 241, 0.1)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <span>Institute</span>
                <span style={{ textAlign: "center" }}>Min Cutoff</span>
                <span style={{ textAlign: "center" }}>
                  {activeTab === "past" ? "Score / Threshold" : "Target %ile"}
                </span>
                {activeTab === "future" && (
                  <span style={{ textAlign: "center" }}>Difficulty</span>
                )}
                <span style={{ textAlign: "center" }}>
                  {activeTab === "past" ? "Chance" : "Study Plan"}
                </span>
              </div>

              {results.map((r, idx) => {
                // Render a tier separator header when the tier changes
                const prevTier = idx > 0 ? results[idx - 1].tier : null;
                const showTierHeader = r.tier !== prevTier;
                return (
                  <React.Fragment key={r.institute}>
                    {showTierHeader && (
                      <div
                        style={{
                          padding: "10px 20px",
                          background: "rgba(99, 102, 241, 0.06)",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#818cf8",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {r.tier === "Tier 1" &&
                          "⭐ Tier 1 — Top IIMs & B-Schools"}
                        {r.tier === "Tier 1.5" &&
                          "🔷 Tier 1.5 — Strong IIMs & B-Schools"}
                        {r.tier === "Tier 2" &&
                          "🔹 Tier 2 — Established IIMs & B-Schools"}
                        {r.tier === "Tier 2.5" &&
                          "◽ Tier 2.5 — Newer / Baby IIMs"}
                        {r.tier === "Tier 3" &&
                          "📋 Tier 3 — Other Reputed B-Schools"}
                      </div>
                    )}
                    {activeTab === "past" ? (
                      <ResultRow r={r} idx={idx} />
                    ) : (
                      <RequiredRankRow r={r} idx={idx} />
                    )}
                  </React.Fragment>
                );
              })}
            </GlassCard>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                marginTop: "16px",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              * Predictions based on CAT 2023-24 RTI data, published admission
              policies, and historical shortlisting data. Actual results may
              vary by year. Composite score weights are approximations of each
              institute's published shortlisting criteria. XLRI not included as
              it uses XAT, not CAT.
            </p>

            {/* Feedback / Discrepancy Banner */}
            <div
              style={{
                marginTop: "24px",
                padding: "16px 20px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.05)",
                border: "1px dashed rgba(99, 102, 241, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertTriangle size={16} color="#818cf8" />
                  Notice a Data Discrepancy?
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  IIM admission criteria change frequently. If you believe a
                  composite weight or cutoff is outdated, let me know to help
                  improve the model!
                </p>
              </div>
              <button
                onClick={() => {
                  const subject = encodeURIComponent(
                    "[MYcat] Predictor Data Discrepancy Report",
                  );
                  const body = encodeURIComponent(
                    "Hi Jayant,\n\nI noticed a discrepancy in the Call Predictor model:\n\nInstitute Name: [e.g., IIM Ahmedabad]\nIssue with: [e.g., Composite Weight / Cutoff Data / Category]\n\nDescription of the issue:\n...\n",
                  );
                  window.location.href = `mailto:gargjayant2@gmail.com?subject=${subject}&body=${body}`;
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)";
                }}
              >
                Report Discrepancy
              </button>
            </div>
          </div>
        )}

        {/* Duration Modal */}
        <AnimatePresence>
          {showDurationModal && (
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
                  onClick={() => setShowDurationModal(false)}
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

                <h2
                  style={{ marginBottom: "8px", color: "var(--text-primary)" }}
                >
                  Start Your Study Plan
                </h2>

                <p
                  style={{
                    marginBottom: "24px",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                  }}
                >
                  Targeting{" "}
                  <strong>
                    {Math.floor(parseFloat(selectedTargetPercentile))}+ %ile
                  </strong>
                  . How much time do you have to prepare for CAT?
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleQuickDuration(m)}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        background: "var(--bg-button)",
                        border: "var(--glass-border)",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "var(--bg-button-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--bg-button)";
                      }}
                    >
                      <Clock size={16} /> {m} Months
                    </button>
                  ))}
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

                <button
                  onClick={handleCreatePlan}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "none",
                    background: "var(--primary-gradient)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create My Plan
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CallPredictor;
