import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import StudyPlan from "./pages/StudyPlan";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import CallPredictor from "./pages/CallPredictor";
import { StudyProvider, useStudy } from "./context/StudyContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PomodoroProvider } from "./context/PomodoroContext";
import "./styles/catprep.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useStudy();

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );

  if (!user) {
    return <Navigate to="/catprep/setup" replace />;
  }
  return children;
};

const CatPrepRoutes = () => {
  return (
    <Routes>
      <Route path="/setup" element={<Onboarding />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="plan" element={<StudyPlan />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="predictor" element={<CallPredictor />} />
      </Route>
    </Routes>
  );
};

const CatPrepApp = () => {
  return (
    <div className="catprep-root">
      <ThemeProvider>
        <StudyProvider>
          <PomodoroProvider>
            <CatPrepRoutes />
          </PomodoroProvider>
        </StudyProvider>
      </ThemeProvider>
    </div>
  );
};

export default CatPrepApp;
