import { SYLLABUS } from '../data/syllabus';

// ============================================================
// THE AI CONFIGURATION MATRIX
// Returns precise targets for every combination of 
// targetPercentile × daysAvailable. This is the brain.
// ============================================================
const getAIConfig = (daysAvailable, targetPercentile) => {
  // ---- TIME TIER ----
  // short: ≤ 90 days (3 months), medium: 91–180 (6 months), long: 181–270 (9 months), extended: 271+ (12 months)
  let timeTier;
  if (daysAvailable <= 90)       timeTier = 'short';
  else if (daysAvailable <= 180) timeTier = 'medium';
  else if (daysAvailable <= 270) timeTier = 'long';
  else                           timeTier = 'extended';

  // ---- BASE CONFIG TABLE ----
  // Each cell: [flMocks, sectionals, revisionEveryNDays, phaseSplit {foundation%, practice%, mocks%}, maxLearningPerDay, practiceLabel, practiceQuestionsTag]
  const matrix = {
    '80+': {
      short:    { flMocks: 6,  sectionals: 3,  revEvery: 21, phases: [0.55, 0.30, 0.15], maxLearnPerDay: 3, practiceLabel: 'Solve 10 easy-to-medium conceptual questions', practiceDepth: { high: 1, medium: 1, low: 0 } },
      medium:   { flMocks: 10, sectionals: 5,  revEvery: 21, phases: [0.55, 0.30, 0.15], maxLearnPerDay: 2, practiceLabel: 'Solve 10-15 basic level questions',           practiceDepth: { high: 1, medium: 1, low: 1 } },
      long:     { flMocks: 12, sectionals: 6,  revEvery: 21, phases: [0.55, 0.28, 0.17], maxLearnPerDay: 2, practiceLabel: 'Solve 15 standard questions',                  practiceDepth: { high: 2, medium: 1, low: 1 } },
      extended: { flMocks: 15, sectionals: 8,  revEvery: 21, phases: [0.55, 0.28, 0.17], maxLearnPerDay: 1, practiceLabel: 'Solve 15 standard questions at a relaxed pace',  practiceDepth: { high: 2, medium: 1, low: 1 } },
    },
    '90+': {
      short:    { flMocks: 8,  sectionals: 5,  revEvery: 14, phases: [0.50, 0.30, 0.20], maxLearnPerDay: 3, practiceLabel: 'Solve 15-20 standard difficulty questions',          practiceDepth: { high: 2, medium: 1, low: 0 } },
      medium:   { flMocks: 15, sectionals: 8,  revEvery: 14, phases: [0.50, 0.30, 0.20], maxLearnPerDay: 2, practiceLabel: 'Solve 15-20 standard difficulty questions',          practiceDepth: { high: 2, medium: 1, low: 1 } },
      long:     { flMocks: 20, sectionals: 10, revEvery: 14, phases: [0.50, 0.30, 0.20], maxLearnPerDay: 2, practiceLabel: 'Solve 20 mixed difficulty questions',                practiceDepth: { high: 2, medium: 2, low: 1 } },
      extended: { flMocks: 25, sectionals: 12, revEvery: 14, phases: [0.50, 0.30, 0.20], maxLearnPerDay: 1, practiceLabel: 'Solve 20 questions with detailed solution analysis', practiceDepth: { high: 2, medium: 2, low: 1 } },
    },
    '95+': {
      short:    { flMocks: 10, sectionals: 6,  revEvery: 14, phases: [0.45, 0.35, 0.20], maxLearnPerDay: 4, practiceLabel: 'Solve 20 medium-to-hard level questions',                  practiceDepth: { high: 2, medium: 2, low: 1 } },
      medium:   { flMocks: 20, sectionals: 10, revEvery: 14, phases: [0.45, 0.35, 0.20], maxLearnPerDay: 3, practiceLabel: 'Solve 20 medium-to-hard level questions',                  practiceDepth: { high: 3, medium: 2, low: 1 } },
      long:     { flMocks: 25, sectionals: 12, revEvery: 14, phases: [0.45, 0.32, 0.23], maxLearnPerDay: 2, practiceLabel: 'Solve 25 graded questions (easy to hard)',                 practiceDepth: { high: 3, medium: 2, low: 1 } },
      extended: { flMocks: 30, sectionals: 15, revEvery: 14, phases: [0.45, 0.32, 0.23], maxLearnPerDay: 2, practiceLabel: 'Solve 25 questions with increasing complexity each set',   practiceDepth: { high: 3, medium: 2, low: 1 } },
    },
    '99+': {
      short:    { flMocks: 12, sectionals: 8,  revEvery: 14, phases: [0.40, 0.35, 0.25], maxLearnPerDay: 4, practiceLabel: 'Solve 30 advanced, exam-level questions under time pressure',  practiceDepth: { high: 3, medium: 2, low: 1 } },
      medium:   { flMocks: 25, sectionals: 12, revEvery: 14, phases: [0.40, 0.35, 0.25], maxLearnPerDay: 3, practiceLabel: 'Solve 30 advanced, exam-level questions under time pressure',  practiceDepth: { high: 3, medium: 3, low: 2 } },
      long:     { flMocks: 30, sectionals: 15, revEvery: 14, phases: [0.40, 0.33, 0.27], maxLearnPerDay: 2, practiceLabel: 'Solve 30+ hard questions with detailed error logging',         practiceDepth: { high: 3, medium: 3, low: 2 } },
      extended: { flMocks: 35, sectionals: 18, revEvery: 14, phases: [0.40, 0.33, 0.27], maxLearnPerDay: 2, practiceLabel: 'Solve 30+ questions, analyze every wrong answer deeply',       practiceDepth: { high: 4, medium: 3, low: 2 } },
    }
  };

  // Fallback to 95+ if an unrecognized percentile is provided
  const pConfig = matrix[targetPercentile] || matrix['95+'];
  return pConfig[timeTier];
};

// ============================================================
// SYLLABUS TRIAGE RULES
// Determines which topics to INCLUDE based on the target
// ============================================================
const shouldIncludeTopic = (topic, targetPercentile) => {
  const p = topic.priority; // 'P1', 'P2', 'P3'
  const d = topic.difficulty;

  if (targetPercentile === '80+') {
    // 80+: Only P1 topics. Also drop ALL hard topics regardless.
    if (p !== 'P1') return false;
    if (d === 'hard') return false;
    return true;
  }

  if (targetPercentile === '90+') {
    // 90+: P1 + P2 topics. Drop P3 and hard P2s.
    if (p === 'P3') return false;
    if (p === 'P2' && d === 'hard') return false;
    return true;
  }

  if (targetPercentile === '95+') {
    // 95+: P1 + P2 + everything except P3 hard topics.
    if (p === 'P3' && d === 'hard') return false;
    return true;
  }

  // 99+: Include absolutely everything.
  return true;
};

// ============================================================
// PRIORITY SCORER
// Higher score = earlier in the queue
// ============================================================
const calculatePriority = (topic, targetPercentile) => {
  // PRIMARY AXIS: Priority Tier (P1 > P2 > P3)
  // This ensures ALL P1 topics come before ANY P2 topic.
  const tierBase = topic.priority === 'P1' ? 300 : (topic.priority === 'P2' ? 200 : 100);

  // SECONDARY AXIS: Historical CAT exam weightage within the tier
  const examWeight = (topic.catWeightage || 3);

  // TERTIARY: Small percentile-specific adjustments (max ±8, never crosses tiers)
  let modifier = 0;
  if (targetPercentile === '99+') {
    if (topic.difficulty === 'hard') modifier += 5;
  } else if (targetPercentile === '80+') {
    if (topic.difficulty === 'easy') modifier += 5;
  }

  return tierBase + examWeight + modifier;
};

// ============================================================
// MAIN GENERATOR
// ============================================================
export const generateStudyPlan = (daysAvailable, startDate = new Date(), targetPercentile = '95+') => {
  const plan = [];
  const subjects = ['QA', 'VARC', 'DILR'];

  // 1. GET AI CONFIG for this exact combination
  const config = getAIConfig(daysAvailable, targetPercentile);

  // 2. CALCULATE PHASE BOUNDARIES
  const daysFoundation = Math.floor(daysAvailable * config.phases[0]);
  const daysPractice = Math.floor(daysAvailable * config.phases[1]);
  // daysMocks is the remainder

  // 3. FLATTEN & TRIAGE SYLLABUS
  const learningUnits = [];
  const practiceUnits = [];

  subjects.forEach(subject => {
    SYLLABUS[subject].forEach(topic => {
      // --- TRIAGE: Should we include this topic at all? ---
      if (!shouldIncludeTopic(topic, targetPercentile)) return;

      // --- PRIORITY SCORING ---
      const priority = calculatePriority(topic, targetPercentile);

      // Flatten subtopics into discrete learning units
      topic.subtopics.forEach((sub, subIdx) => {
        learningUnits.push({
          id: `${topic.id}_${sub.replace(/\s+/g, '_').toLowerCase()}`,
          topic: topic.topic,
          title: sub,
          subject,
          weight: topic.weight,
          difficulty: topic.difficulty,
          type: 'learning',
          priorityScore: priority - (subIdx * 0.1), // Slight decay for sub-ordering
          completed: false
        });
      });

      // --- ADAPTIVE PRACTICE SETS ---
      const wKey = topic.weight; // 'high', 'medium', 'low'
      const practiceCount = config.practiceDepth[wKey] || 1;

      for (let p = 0; p < practiceCount; p++) {
        practiceUnits.push({
          id: `${topic.id}_practice_${p}`,
          topic: `${topic.topic} - Practice Set ${p + 1}`,
          subject,
          type: 'practice',
          isPractice: true,
          weight: topic.weight,
          priorityScore: priority,
          completed: false,
          subtopics: [{ title: config.practiceLabel, completed: false }]
        });
      }
    });
  });

  // Sort by priority (highest first) within each subject
  learningUnits.sort((a, b) => b.priorityScore - a.priorityScore);
  practiceUnits.sort((a, b) => b.priorityScore - a.priorityScore);

  // 4. ROUND-ROBIN SUBJECT INTERLEAVE
  // Prevents long streaks of the same subject. Rotates QA → VARC → DILR
  // while preserving relative priority order within each subject.
  const interleaveBySubject = (units) => {
    const queues = { QA: [], VARC: [], DILR: [] };
    units.forEach(u => {
      if (queues[u.subject]) queues[u.subject].push(u);
    });
    
    const result = [];
    const order = ['QA', 'VARC', 'DILR']; // Rotation order
    const indices = { QA: 0, VARC: 0, DILR: 0 };
    let emptyCount = 0;

    while (emptyCount < 3) {
      emptyCount = 0;
      for (const subj of order) {
        if (indices[subj] < queues[subj].length) {
          result.push(queues[subj][indices[subj]]);
          indices[subj]++;
        } else {
          emptyCount++;
        }
      }
    }
    return result;
  };

  const interleavedLearning = interleaveBySubject(learningUnits);
  const interleavedPractice = interleaveBySubject(practiceUnits);

  // 5. CAPACITY CLIPPING (prevent impossible daily loads)
  const maxLearn = config.maxLearnPerDay;
  const maxFoundationCapacity = daysFoundation * maxLearn;
  const maxPracticeCapacity = daysPractice * maxLearn;

  const foundationQueue = interleavedLearning.slice(0, maxFoundationCapacity);
  const practiceQueue = interleavedPractice.slice(0, maxPracticeCapacity);

  const foundationSlotsPerDay = Math.max(1, Math.ceil(foundationQueue.length / Math.max(1, daysFoundation)));
  const practiceSlotsPerDay = Math.max(1, Math.ceil(practiceQueue.length / Math.max(1, daysPractice)));

  // 5. DISTRIBUTE FL MOCKS & SECTIONALS as explicit day sets
  const flMockDays = new Set([1]); // Day 1: Diagnostic always
  const remainingFL = config.flMocks - 1;

  // Phase distribution: 15% in Foundation, 25% in Practice, 60% in Final
  const flP1 = Math.max(1, Math.round(remainingFL * 0.15));
  const flP2 = Math.max(1, Math.round(remainingFL * 0.25));
  const flP3 = Math.max(1, remainingFL - flP1 - flP2);

  const pickDays = (start, end, count) => {
    if (count <= 0 || start > end) return [];
    const range = end - start + 1;
    if (count >= range) return Array.from({ length: range }, (_, i) => start + i);
    const step = range / count;
    return Array.from({ length: count }, (_, i) => Math.floor(start + step / 2 + i * step));
  };

  const pickAvailable = (start, end, count, avoidSet) => {
    const pool = [];
    for (let i = start; i <= end; i++) {
      if (!avoidSet.has(i)) pool.push(i);
    }
    if (pool.length === 0 || count <= 0) return [];
    const step = pool.length / count;
    return Array.from({ length: Math.min(count, pool.length) }, (_, i) => pool[Math.floor(step / 2 + i * step)]);
  };

  pickDays(2, daysFoundation, flP1).forEach(d => flMockDays.add(d));
  pickDays(daysFoundation + 1, daysFoundation + daysPractice, flP2).forEach(d => flMockDays.add(d));
  pickDays(daysFoundation + daysPractice + 1, daysAvailable, flP3).forEach(d => flMockDays.add(d));

  // Sectionals: 40% in Practice, 60% in Final phase. Avoid FL days.
  const sectionalDays = new Set();
  const secP2 = Math.max(1, Math.round(config.sectionals * 0.4));
  const secP3 = config.sectionals - secP2;
  pickAvailable(daysFoundation + 1, daysFoundation + daysPractice, secP2, flMockDays).forEach(d => sectionalDays.add(d));
  pickAvailable(daysFoundation + daysPractice + 1, daysAvailable, secP3, flMockDays).forEach(d => sectionalDays.add(d));

  // 6. REVISION FREQUENCY from config
  const revFreq = config.revEvery;
  const revLabel = revFreq <= 5 ? 'Intensive Revision Day' : (revFreq <= 7 ? 'Weekly Revision Day' : 'Bi-weekly Revision Day');

  // 7. GENERATION LOOP
  let fIdx = 0;
  let pIdx = 0;
  const topicHistory = [];

  const createDay = (dayNum, date, isRev, tasks) => ({
    day: dayNum,
    date: date.toISOString(),
    isRevision: isRev,
    tasks
  });

  const harvestRevisionTopics = () => {
    const recent = topicHistory.slice(-25);
    const unique = [...new Set(recent.map(u => u.topic))];
    const revTopics = unique.slice(-5).map(t => ({ title: `Review formulas/concepts: ${t}`, completed: false }));
    return revTopics.length > 0 ? revTopics : [{ title: 'Review structural basics & weak spots', completed: false }];
  };

  for (let d = 0; d < daysAvailable; d++) {
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + d);
    const dayNum = d + 1;
    const dayTasks = [];

    // --- Priority 1: Full Length Mock ---
    if (flMockDays.has(dayNum)) {
      plan.push(createDay(dayNum, curDate, true, [{
        id: dayNum === 1 ? 'diagnostic_mock' : `mock_${dayNum}`,
        topic: dayNum === 1 ? 'Baseline Diagnostic Mock Test' : 'Full Length Mock Test',
        subject: 'General',
        type: 'mock',
        completed: false,
        subtopics: [
          { title: dayNum === 1 ? 'Take 2-hr Full Mock without pausing to establish baseline' : 'Take 2-hr Full Mock under actual exam conditions', completed: false },
          { title: dayNum === 1 ? 'Log relative strengths & weaknesses naturally' : 'Analyze mistakes, pinpoint weak subjects, track percentile growth', completed: false }
        ]
      }]));
      continue;
    }

    // --- Priority 2: Sectional Mock ---
    if (sectionalDays.has(dayNum)) {
      const pool = ['QA', 'VARC', 'DILR'];
      const idx = Array.from(sectionalDays).sort((a, b) => a - b).indexOf(dayNum);
      const subj = pool[idx % 3];

      plan.push(createDay(dayNum, curDate, true, [{
        id: `sectional_${dayNum}`,
        topic: `${subj} Sectional Test`,
        subject: subj,
        type: 'sectional',
        completed: false,
        subtopics: [
          { title: `Attempt 40-min ${subj} Sectional`, completed: false },
          { title: 'In-depth analysis of weak areas', completed: false }
        ]
      }]));
      continue;
    }

    // --- Priority 3: Revision Day ---
    const isPhase3 = dayNum > (daysFoundation + daysPractice);
    if (!isPhase3 && dayNum > 1 && (dayNum % revFreq === 0)) {
      plan.push(createDay(dayNum, curDate, true, [{
        id: `rev_${dayNum}`,
        topic: revLabel,
        subject: 'General',
        type: 'revision',
        completed: false,
        subtopics: harvestRevisionTopics()
      }]));
      continue;
    }

    // --- Priority 4: Normal Study Day ---
    if (dayNum <= daysFoundation && fIdx < foundationQueue.length) {
      // FOUNDATION PHASE
      const slots = Math.min(foundationSlotsPerDay, maxLearn);
      for (let s = 0; s < slots && fIdx < foundationQueue.length; s++) {
        const unit = foundationQueue[fIdx];
        topicHistory.push(unit);

        const existing = dayTasks.find(t => t.topic === unit.topic);
        if (existing) {
          existing.subtopics.push({ title: unit.title, completed: false });
        } else {
          dayTasks.push({
            id: unit.id,
            topic: unit.topic,
            subject: unit.subject,
            type: unit.type,
            completed: false,
            subtopics: [{ title: unit.title, completed: false }]
          });
        }
        fIdx++;
      }

    } else if (pIdx < practiceQueue.length) {
      // PRACTICE / FINAL PHASE
      const slots = isPhase3 ? 1 : Math.min(practiceSlotsPerDay, maxLearn);
      for (let s = 0; s < slots && pIdx < practiceQueue.length; s++) {
        const unit = practiceQueue[pIdx];

        if (isPhase3 && s === 0 && dayTasks.length === 0) {
          unit.subtopics.push({ title: 'Focus specifically on heavily tested sub-types', completed: false });
        }

        dayTasks.push({
          id: unit.id,
          topic: unit.topic,
          subject: unit.subject,
          type: unit.type,
          completed: false,
          subtopics: unit.subtopics
        });
        pIdx++;
      }
    } else {
      // ALL QUEUES EXHAUSTED → Final Sprint Revision
      dayTasks.push({
        id: `final_rev_${dayNum}`,
        topic: 'Final Sprint Review',
        subject: 'General',
        type: 'revision',
        completed: false,
        subtopics: harvestRevisionTopics()
      });
    }

    if (dayTasks.length > 0) {
      plan.push(createDay(dayNum, curDate, false, dayTasks));
    }
  }

  return plan;
};
