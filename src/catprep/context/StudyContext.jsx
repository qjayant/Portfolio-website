import React, { createContext, useContext, useState, useEffect } from "react";
import { generateStudyPlan } from "../utils/planGenerator";
import { BADGES } from "../data/badges";

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState([]);
  const [progress, setProgress] = useState({
    completedCount: 0,
    streak: 0,
    badges: [],
    subjectCounts: { QA: 0, VARC: 0, DILR: 0 },
    testsTaken: { fullMocks: 0, sectionals: 0 }, // New Analytics Metric
  });
  const [loading, setLoading] = useState(true);
  const [showConsistencyToast, setShowConsistencyToast] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState(null);

  const calculateStreak = (currentPlan) => {
    if (!currentPlan || currentPlan.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let foundTodayOrPast = false;

    // Iterate backwards from the end of the plan
    for (let i = currentPlan.length - 1; i >= 0; i--) {
      const day = currentPlan[i];
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (dayDate > today) continue; // Skip future days

      // We found today or the most recent past day
      foundTodayOrPast = true;

      // Check if all tasks for this day are completed
      const allCompleted =
        day.tasks.length > 0 && day.tasks.every((t) => t.completed);

      if (allCompleted) {
        streak++;
      } else {
        // If it's today and not all completed, we don't break the streak yet
        // because the day isn't over. The streak is based on previous days.
        // If it's a past day and not completed, the streak breaks.
        if (dayDate.getTime() !== today.getTime()) {
          break;
        }
      }
    }
    return streak;
  };

  useEffect(() => {
    // Load data from local storage
    const savedUser = localStorage.getItem("cat_prep_user");
    const savedPlan = localStorage.getItem("cat_prep_plan");
    const savedProgress = localStorage.getItem("cat_prep_progress");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedPlan) {
      let parsedPlan = JSON.parse(savedPlan);

      // Data Migration: Convert string subtopics to objects if needed
      let dataMigrated = false;
      parsedPlan = parsedPlan.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => {
          if (
            task.subtopics &&
            task.subtopics.length > 0 &&
            typeof task.subtopics[0] === "string"
          ) {
            dataMigrated = true;
            return {
              ...task,
              subtopics: task.subtopics.map((s) => ({
                title: s,
                completed: false,
              })),
            };
          }
          return task;
        }),
      }));

      setPlan(parsedPlan);
      setCurrentStreak(calculateStreak(parsedPlan));

      if (dataMigrated) {
        localStorage.setItem("cat_prep_plan", JSON.stringify(parsedPlan));
      }
    }
    if (savedProgress) {
      let parsedProgress = JSON.parse(savedProgress);
      // Data Migration: Add testsTaken tracking if this is an old account
      let progMigrated = false;
      if (!parsedProgress.testsTaken) {
        parsedProgress.testsTaken = { fullMocks: 0, sectionals: 0 };
        progMigrated = true;
      }
      setProgress(parsedProgress);
      if (progMigrated)
        localStorage.setItem(
          "cat_prep_progress",
          JSON.stringify(parsedProgress),
        );
    }

    setLoading(false);
  }, []);

  const startPrep = (
    name,
    examDate,
    startDate = new Date(),
    targetPercentile = "95+",
  ) => {
    const newUser = {
      name,
      examDate,
      startDate: startDate.toISOString(),
      targetPercentile,
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("cat_prep_user", JSON.stringify(newUser));

    // Calculate days
    const start = new Date(startDate);
    const exam = new Date(examDate);
    const diffTime = Math.abs(exam - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const newPlan = generateStudyPlan(diffDays, start, targetPercentile);
    setPlan(newPlan);
    localStorage.setItem("cat_prep_plan", JSON.stringify(newPlan));

    // Reset progress on new plan
    const newProgress = {
      completedCount: 0,
      streak: 0,
      badges: [],
      subjectCounts: { QA: 0, VARC: 0, DILR: 0 },
    };
    setProgress(newProgress);
    localStorage.setItem("cat_prep_progress", JSON.stringify(newProgress));
  };

  const checkBadges = (currentProgress) => {
    const unlockedBadges = [...(currentProgress.badges || [])];
    let lastUnlockedBadge = null;

    // Calculate total tasks for percentage based badges
    const totalTasks = plan.reduce((acc, day) => acc + day.tasks.length, 0);

    BADGES.forEach((badge) => {
      if (!unlockedBadges.includes(badge.id)) {
        const conditionMet =
          badge.id === "half_way"
            ? badge.condition(currentProgress, totalTasks)
            : badge.condition(currentProgress);

        if (conditionMet) {
          unlockedBadges.push(badge.id);
          lastUnlockedBadge = badge;
        }
      }
    });

    if (lastUnlockedBadge) {
      setNewlyUnlockedBadge(lastUnlockedBadge);
      setTimeout(() => setNewlyUnlockedBadge(null), 5000);
    }

    return unlockedBadges;
  };

  const updateProgress = (task, isCompleted, dayIndex) => {
    const newProgress = { ...progress };

    // Update counts
    newProgress.completedCount =
      (newProgress.completedCount || 0) + (isCompleted ? 1 : -1);

    // Update subject counts
    const subject = task.subject;
    if (!newProgress.subjectCounts)
      newProgress.subjectCounts = { QA: 0, VARC: 0, DILR: 0 };
    newProgress.subjectCounts[subject] =
      (newProgress.subjectCounts[subject] || 0) + (isCompleted ? 1 : -1);

    // Update specific test analytics
    if (!newProgress.testsTaken) {
      newProgress.testsTaken = { fullMocks: 0, sectionals: 0 };
    }
    if (task.type === "mock") {
      newProgress.testsTaken.fullMocks = Math.max(
        0,
        newProgress.testsTaken.fullMocks + (isCompleted ? 1 : -1),
      );
    } else if (task.type === "sectional") {
      newProgress.testsTaken.sectionals = Math.max(
        0,
        newProgress.testsTaken.sectionals + (isCompleted ? 1 : -1),
      );
    }

    // Update streak logic
    const newPlan = [...plan];
    const newStreak = calculateStreak(newPlan);
    setCurrentStreak(newStreak);
    newProgress.streak = newStreak;

    // Check Badges
    newProgress.badges = checkBadges(newProgress);

    setProgress(newProgress);
    localStorage.setItem("cat_prep_progress", JSON.stringify(newProgress));

    // Check if we should show consistency toast (Current day all completed)
    if (isCompleted && typeof dayIndex !== "undefined") {
      const completedDay = newPlan[dayIndex];
      const today = new Date();
      const dayDate = new Date(completedDay.date);

      const isToday =
        dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear();

      if (isToday) {
        const allTasksCompleted = completedDay.tasks.every((t) => t.completed);
        if (allTasksCompleted) {
          setShowConsistencyToast(true);
          // Auto hide
          setTimeout(() => setShowConsistencyToast(false), 4000);
        }
      }
    }
  };

  const toggleSubtopic = (dayIndex, taskId, subtopicIndex) => {
    const newPlan = [...plan];
    const day = newPlan[dayIndex];
    const task = day.tasks.find((t) => t.id === taskId);

    if (task && task.subtopics) {
      const subtopic = task.subtopics[subtopicIndex];
      subtopic.completed = !subtopic.completed;

      // Check if all subtopics are completed
      const allCompleted = task.subtopics.every((s) => s.completed);

      // Only update parent if status changed
      if (task.completed !== allCompleted) {
        task.completed = allCompleted;

        // Save the plan BEFORE calling updateProgress so calculateStreak uses the freshest plan
        setPlan(newPlan);
        localStorage.setItem("cat_prep_plan", JSON.stringify(newPlan));

        updateProgress(task, allCompleted, dayIndex);
      } else {
        setPlan(newPlan);
        localStorage.setItem("cat_prep_plan", JSON.stringify(newPlan));
      }
    }
  };

  const markTaskComplete = (dayIndex, taskId) => {
    const newPlan = [...plan];
    const day = newPlan[dayIndex];
    if (day) {
      const task = day.tasks.find((t) => t.id === taskId);
      if (task) {
        // Toggle completion
        const wasCompleted = task.completed;
        task.completed = !wasCompleted;

        // Sync subtopics
        if (task.subtopics) {
          task.subtopics.forEach((s) => (s.completed = task.completed));
        }

        // Save the plan BEFORE calling updateProgress so calculateStreak uses the freshest plan
        setPlan(newPlan);
        localStorage.setItem("cat_prep_plan", JSON.stringify(newPlan));

        updateProgress(task, task.completed, dayIndex);
      }
    }
  };

  return (
    <StudyContext.Provider
      value={{
        user,
        plan,
        progress,
        loading,
        startPrep,
        markTaskComplete,
        toggleSubtopic,
        currentStreak,
        showConsistencyToast,
        setShowConsistencyToast,
        newlyUnlockedBadge,
        setNewlyUnlockedBadge,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};
