import React from "react";
import GlassCard from "../components/ui/GlassCard";
import { useStudy } from "../context/StudyContext";
import { usePageSEO } from "../hooks/usePageSEO";
import { Target, ClipboardList } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import PomodoroHeaderTimer from "../components/PomodoroHeaderTimer";

const Analytics = () => {
  const { plan, progress } = useStudy();
  usePageSEO(
    "Performance Analytics",
    "Analyze your CAT preparation performance with subject mastery charts, daily consistency tracking, and mock test statistics.",
  );

  // Handle missing properties gracefully
  const mocksTaken = progress?.testsTaken?.fullMocks || 0;
  const sectionalsTaken = progress?.testsTaken?.sectionals || 0;

  // Data prep
  const subjectData = [
    { name: "QA", total: 0, completed: 0, color: "#6366f1" },
    { name: "VARC", total: 0, completed: 0, color: "#f43f5e" },
    { name: "DILR", total: 0, completed: 0, color: "#fb923c" },
  ];

  plan.forEach((day) => {
    day.tasks.forEach((task) => {
      const subject = subjectData.find((s) => s.name === task.subject);
      if (subject) {
        subject.total++;
        if (task.completed) subject.completed++;
      }
    });
  });

  // Generate data for the entire study plan duration
  const completionData = plan.map((day) => {
    // Determine the month and day for a cleaner X-axis
    const dateObj = new Date(day.date);
    const dateLabel = `${dateObj.getDate()} ${dateObj.toLocaleString("default", { month: "short" })}`;

    return {
      day: `Day ${day.day}`,
      dateLabel: dateLabel,
      completed: day.tasks.filter((t) => t.completed).length,
      total: day.tasks.length,
    };
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0 }}>Performance Analytics</h1>
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

      {/* Top Level Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <GlassCard
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(192, 132, 252, 0.15)",
              padding: "12px",
              borderRadius: "12px",
            }}
          >
            <Target size={28} color="#c084fc" />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              Full Mocks Taken
            </p>
            <h2
              style={{
                margin: 0,
                color: "var(--text-primary)",
                fontSize: "28px",
              }}
            >
              {mocksTaken}
            </h2>
          </div>
        </GlassCard>

        <GlassCard
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(45, 212, 191, 0.15)",
              padding: "12px",
              borderRadius: "12px",
            }}
          >
            <ClipboardList size={28} color="#2dd4bf" />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              Sectionals Taken
            </p>
            <h2
              style={{
                margin: 0,
                color: "var(--text-primary)",
                fontSize: "28px",
              }}
            >
              {sectionalsTaken}
            </h2>
          </div>
        </GlassCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
        }}
      >
        <GlassCard>
          <h3>Subject Mastery</h3>
          <div style={{ height: "300px", width: "100%", marginTop: "20px" }}>
            <ResponsiveContainer>
              <BarChart data={subjectData}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar
                  dataKey="completed"
                  name="Completed Topics"
                  radius={[4, 4, 0, 0]}
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3>Daily Consistency</h3>
          <div style={{ height: "300px", width: "100%", marginTop: "20px" }}>
            <ResponsiveContainer>
              <LineChart
                data={completionData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="dateLabel"
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 12 }}
                  minTickGap={30} // Prevent overlapping labels on long plans
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#22d3ee", fontWeight: "bold" }}
                  labelStyle={{
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                  formatter={(value, name) => [value, "Tasks Completed"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="url(#colorCompleted)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#22d3ee",
                    stroke: "#1e293b",
                    strokeWidth: 2,
                  }}
                />
                <defs>
                  <linearGradient
                    id="colorCompleted"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
