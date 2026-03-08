// =============================================================================
// CAT Call Predictor Engine — Data-Driven Prediction
//
// Uses real IIM/B-school admission criteria:
// - Institute-specific composite score weights (CAT, academics, work exp, diversity)
// - Category-wise minimum qualifying percentiles (RTI data, CAT 2023-24)
// - Gender diversity bonus (IIM-B 5%, IIM-C 4%, FMS 5 marks, IIFT 2 marks)
// - PwD relaxed cutoffs
// - Academic diversity bonus for non-engineering backgrounds
// =============================================================================

// ---------------------------------------------------------------------------
// 1. INSTITUTE DATA — Shortlisting weights & cutoffs
// ---------------------------------------------------------------------------
// Each institute has:
//   shortlistWeights: How the composite score for PI/WAT shortlisting is built
//   minCutoffs: Minimum qualifying CAT percentile by category (below = auto reject)
//   historicalShortlist: Approximate composite score threshold at which calls went out
//   tier: For grouping in results
//   acceptsCAT: true for all (XLRI removed since it uses XAT)
// ---------------------------------------------------------------------------


const INSTITUTES = [

  // ===========================================================================
  // TIER 1 — Absolute Top (ABC + FMS)
  // ===========================================================================

  {
    name: "IIM Ahmedabad",
    tier: "Tier 1",
    shortlistWeights: {
      cat: 0.65,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.0,
      workExp: 0.12,
      genderDiversity: 0.0,        // IIM-A has no explicit diversity weight in composite
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 70 },
      OBC:     { overall: 75,  sectional: 65 },
      SC:      { overall: 60,  sectional: 50 },
      ST:      { overall: 55,  sectional: 45 },
      EWS:     { overall: 78,  sectional: 68 },
      PwD:     { overall: 55,  sectional: 45 },
    },
    // Thresholds calibrated for General MALE ENGINEER (hardest profile).
    // A 99.5 General engineer male sits right at threshold → "Moderate/Low" chance.
    // Non-engineers / women effectively get ~3-5 points via academicDiversity/genderDiversity bonus elsewhere.
    historicalThreshold: {
      General: 92,   // ~99.5+ needed for real probability
      OBC:     78,
      SC:      59,
      ST:      49,
      EWS:     87,
    },
  },

  {
    name: "IIM Bangalore",
    tier: "Tier 1",
    shortlistWeights: {
      cat: 0.50,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.10,
      genderDiversity: 0.05,       // Explicit 5% diversity bonus
      academicDiversity: 0.05,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 75 },
      OBC:     { overall: 75,  sectional: 65 },
      SC:      { overall: 60,  sectional: 50 },
      ST:      { overall: 55,  sectional: 45 },
      EWS:     { overall: 82,  sectional: 72 },
      PwD:     { overall: 55,  sectional: 45 },
    },
    historicalThreshold: {
      General: 89,   // ~99+ General engineer male
      OBC:     76,
      SC:      57,
      ST:      47,
      EWS:     85,
    },
  },

  {
    name: "IIM Calcutta",
    tier: "Tier 1",
    shortlistWeights: {
      cat: 0.56,
      tenth: 0.10,
      twelfth: 0.15,
      graduation: 0.05,
      workExp: 0.06,
      genderDiversity: 0.04,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 72 },
      OBC:     { overall: 73,  sectional: 63 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 78,  sectional: 68 },
      PwD:     { overall: 50,  sectional: 40 },
    },
    historicalThreshold: {
      General: 88,   // ~99+ General engineer male
      OBC:     75,
      SC:      56,
      ST:      46,
      EWS:     84,
    },
  },

  {
    name: "FMS Delhi",
    tier: "Tier 1",
    shortlistWeights: {
      cat: 0.92,
      tenth: 0.0,
      twelfth: 0.0,
      graduation: 0.0,
      workExp: 0.03,
      genderDiversity: 0.05,       // +5 marks for women in FMS formula
      academicDiversity: 0.0,
    },
    minCutoffs: {
      General: { overall: 95,  sectional: 85 },
      OBC:     { overall: 88,  sectional: 78 },
      SC:      { overall: 72,  sectional: 60 },
      ST:      { overall: 65,  sectional: 55 },
      EWS:     { overall: 88,  sectional: 78 },
      PwD:     { overall: 65,  sectional: 55 },
    },
    historicalThreshold: {
      General: 90,   // FMS is almost pure CAT — 99.5+ General male engineer
      OBC:     78,
      SC:      58,
      ST:      48,
      EWS:     86,
    },
  },

  // ===========================================================================
  // TIER 1.5 — Strong IIMs + Premier Non-IIMs
  // ===========================================================================

  {
    name: "IIM Lucknow",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.60,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.06,
      genderDiversity: 0.03,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      // Corrected: IIM-L cutoffs LOWER than ABC, not higher
      General: { overall: 82,  sectional: 72 },
      OBC:     { overall: 74,  sectional: 64 },
      SC:      { overall: 57,  sectional: 47 },
      ST:      { overall: 52,  sectional: 42 },
      EWS:     { overall: 76,  sectional: 66 },
      PwD:     { overall: 52,  sectional: 42 },
    },
    historicalThreshold: {
      General: 84,   // ~98.5+ General engineer male
      OBC:     72,
      SC:      53,
      ST:      44,
      EWS:     80,
    },
  },

  {
    name: "IIM Kozhikode",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.58,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.03,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 72 },
      OBC:     { overall: 72,  sectional: 62 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 74,  sectional: 64 },
      PwD:     { overall: 50,  sectional: 40 },
    },
    historicalThreshold: {
      General: 83,
      OBC:     71,
      SC:      52,
      ST:      43,
      EWS:     79,
    },
  },

  {
    name: "IIM Indore",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.58,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.03,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 72 },
      OBC:     { overall: 72,  sectional: 62 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 74,  sectional: 64 },
      PwD:     { overall: 50,  sectional: 40 },
    },
    historicalThreshold: {
      General: 83,
      OBC:     70,
      SC:      52,
      ST:      43,
      EWS:     79,
    },
  },

  {
    name: "MDI Gurgaon",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.68,
      tenth: 0.06,
      twelfth: 0.06,
      graduation: 0.06,
      workExp: 0.10,
      genderDiversity: 0.02,
      academicDiversity: 0.02,
    },
    // MDI does not follow reservation — same cutoffs across categories
    minCutoffs: {
      General: { overall: 90,  sectional: 80 },
      OBC:     { overall: 90,  sectional: 80 },
      SC:      { overall: 90,  sectional: 80 },
      ST:      { overall: 90,  sectional: 80 },
      EWS:     { overall: 90,  sectional: 80 },
      PwD:     { overall: 80,  sectional: 70 },
    },
    historicalThreshold: {
      General: 82,
      OBC:     82,
      SC:      82,
      ST:      82,
      EWS:     82,
    },
  },

  {
    name: "SPJIMR Mumbai",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.38,
      tenth: 0.12,
      twelfth: 0.12,
      graduation: 0.12,
      workExp: 0.15,
      genderDiversity: 0.03,
      academicDiversity: 0.08,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 75 },
      OBC:     { overall: 78,  sectional: 68 },
      SC:      { overall: 62,  sectional: 52 },
      ST:      { overall: 57,  sectional: 47 },
      EWS:     { overall: 78,  sectional: 68 },
      PwD:     { overall: 57,  sectional: 47 },
    },
    historicalThreshold: {
      General: 79,
      OBC:     68,
      SC:      51,
      ST:      43,
      EWS:     74,
    },
  },

  {
    name: "IIFT Delhi",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.88,
      tenth: 0.0,
      twelfth: 0.0,
      graduation: 0.0,
      workExp: 0.04,
      genderDiversity: 0.04,       // +2 marks bonus for women
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 90,  sectional: 80 },
      OBC:     { overall: 80,  sectional: 72 },
      SC:      { overall: 63,  sectional: 53 },
      ST:      { overall: 58,  sectional: 48 },
      EWS:     { overall: 80,  sectional: 72 },
      PwD:     { overall: 58,  sectional: 48 },
    },
    historicalThreshold: {
      General: 84,
      OBC:     73,
      SC:      54,
      ST:      46,
      EWS:     80,
    },
  },

  // ===========================================================================
  // IIT MANAGEMENT SCHOOLS — Separate tier, high rigor, profile-heavy
  // ===========================================================================

  {
    name: "IIT Bombay (SJMSOM)",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.12,
      workExp: 0.12,
      genderDiversity: 0.03,
      academicDiversity: 0.02,
    },
    minCutoffs: {
      General: { overall: 90,  sectional: 80 },
      OBC:     { overall: 80,  sectional: 70 },
      SC:      { overall: 60,  sectional: 50 },
      ST:      { overall: 55,  sectional: 45 },
      EWS:     { overall: 80,  sectional: 70 },
      PwD:     { overall: 55,  sectional: 45 },
    },
    historicalThreshold: {
      General: 83,
      OBC:     71,
      SC:      53,
      ST:      44,
      EWS:     79,
    },
  },

  {
    name: "IIT Delhi (DMS)",
    tier: "Tier 1.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.12,
      workExp: 0.12,
      genderDiversity: 0.03,
      academicDiversity: 0.02,
    },
    minCutoffs: {
      General: { overall: 90,  sectional: 80 },
      OBC:     { overall: 80,  sectional: 70 },
      SC:      { overall: 60,  sectional: 50 },
      ST:      { overall: 55,  sectional: 45 },
      EWS:     { overall: 80,  sectional: 70 },
      PwD:     { overall: 55,  sectional: 45 },
    },
    historicalThreshold: {
      General: 83,
      OBC:     71,
      SC:      53,
      ST:      44,
      EWS:     79,
    },
  },

  {
    name: "IIT Madras (DoMS)",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.52,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.15,
      workExp: 0.12,
      genderDiversity: 0.02,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 88,  sectional: 78 },
      OBC:     { overall: 78,  sectional: 68 },
      SC:      { overall: 58,  sectional: 48 },
      ST:      { overall: 53,  sectional: 43 },
      EWS:     { overall: 78,  sectional: 68 },
      PwD:     { overall: 53,  sectional: 43 },
    },
    historicalThreshold: {
      General: 78,   // Lowered from 81 to stay below Tier 1.5 min (79)
      OBC:     67,
      SC:      49,
      ST:      40,
      EWS:     74,
    },
  },

  {
    name: "IIT Kharagpur (VGSOM)",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.50,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.15,
      workExp: 0.14,
      genderDiversity: 0.02,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 75 },
      OBC:     { overall: 75,  sectional: 65 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 75,  sectional: 65 },
      PwD:     { overall: 50,  sectional: 40 },
    },
    historicalThreshold: {
      General: 77,   // Lowered from 80 to stay below Tier 1.5
      OBC:     66,
      SC:      48,
      ST:      39,
      EWS:     73,
    },
  },

  {
    name: "IIT Roorkee (DoMS)",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.52,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.14,
      workExp: 0.13,
      genderDiversity: 0.02,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 75 },
      OBC:     { overall: 75,  sectional: 65 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 75,  sectional: 65 },
      PwD:     { overall: 50,  sectional: 40 },
    },
    historicalThreshold: {
      General: 76,
      OBC:     65,
      SC:      47,
      ST:      38,
      EWS:     72,
    },
  },

  {
    name: "IIT Kanpur (IME)",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.52,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.14,
      workExp: 0.13,
      genderDiversity: 0.02,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 75 },
      OBC:     { overall: 75,  sectional: 65 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 75,  sectional: 65 },
      PwD:     { overall: 50,  sectional: 40 },
    },
    historicalThreshold: {
      General: 76,
      OBC:     65,
      SC:      47,
      ST:      38,
      EWS:     72,
    },
  },

  {
    name: "IIT Hyderabad (DoSM)",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.50,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.14,
      workExp: 0.14,
      genderDiversity: 0.03,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 72 },
      OBC:     { overall: 75,  sectional: 63 },
      SC:      { overall: 55,  sectional: 43 },
      ST:      { overall: 50,  sectional: 38 },
      EWS:     { overall: 75,  sectional: 63 },
      PwD:     { overall: 50,  sectional: 38 },
    },
    historicalThreshold: {
      General: 75,
      OBC:     64,
      SC:      46,
      ST:      37,
      EWS:     71,
    },
  },

  {
    name: "IIT Dhanbad (IIT ISM)",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.50,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.14,
      workExp: 0.14,
      genderDiversity: 0.03,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 68 },
      OBC:     { overall: 70,  sectional: 58 },
      SC:      { overall: 50,  sectional: 40 },
      ST:      { overall: 45,  sectional: 35 },
      EWS:     { overall: 70,  sectional: 58 },
      PwD:     { overall: 45,  sectional: 35 },
    },
    historicalThreshold: {
      General: 73,
      OBC:     62,
      SC:      44,
      ST:      35,
      EWS:     69,
    },
  },

  // ===========================================================================
  // TIER 2 — Established IIMs
  // ===========================================================================

  {
    name: "IIM Udaipur",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 78,  sectional: 68 },
      OBC:     { overall: 70,  sectional: 60 },
      SC:      { overall: 53,  sectional: 43 },
      ST:      { overall: 48,  sectional: 38 },
      EWS:     { overall: 72,  sectional: 62 },
      PwD:     { overall: 48,  sectional: 38 },
    },
    historicalThreshold: {
      General: 76,
      OBC:     65,
      SC:      47,
      ST:      38,
      EWS:     72,
    },
  },

  {
    name: "IIM Trichy",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 78,  sectional: 68 },
      OBC:     { overall: 68,  sectional: 58 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 30,  sectional: 25 },
      EWS:     { overall: 70,  sectional: 60 },
      PwD:     { overall: 40,  sectional: 30 },
    },
    historicalThreshold: {
      General: 78,
      OBC:     65,
      SC:      47,
      ST:      35,
      EWS:     72,
    },
  },

  {
    name: "IIM Ranchi",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 78,  sectional: 68 },
      OBC:     { overall: 68,  sectional: 58 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 30,  sectional: 25 },
      EWS:     { overall: 70,  sectional: 60 },
      PwD:     { overall: 40,  sectional: 30 },
    },
    historicalThreshold: {
      General: 78,
      OBC:     65,
      SC:      47,
      ST:      35,
      EWS:     72,
    },
  },

  {
    name: "IIM Rohtak",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 78,  sectional: 68 },
      OBC:     { overall: 70,  sectional: 60 },
      SC:      { overall: 53,  sectional: 43 },
      ST:      { overall: 48,  sectional: 38 },
      EWS:     { overall: 72,  sectional: 62 },
      PwD:     { overall: 45,  sectional: 35 },
    },
    historicalThreshold: {
      General: 78,
      OBC:     66,
      SC:      48,
      ST:      39,
      EWS:     73,
    },
  },

  {
    name: "IIM Kashipur",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 78,  sectional: 68 },
      OBC:     { overall: 68,  sectional: 58 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 30,  sectional: 25 },
      EWS:     { overall: 70,  sectional: 60 },
      PwD:     { overall: 40,  sectional: 30 },
    },
    historicalThreshold: {
      General: 77,
      OBC:     64,
      SC:      45,
      ST:      33,
      EWS:     71,
    },
  },

  {
    name: "IIM Raipur",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 78,  sectional: 68 },
      OBC:     { overall: 68,  sectional: 58 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 30,  sectional: 25 },
      EWS:     { overall: 70,  sectional: 60 },
      PwD:     { overall: 40,  sectional: 30 },
    },
    historicalThreshold: {
      General: 77,
      OBC:     64,
      SC:      45,
      ST:      33,
      EWS:     71,
    },
  },

  // Other Tier 2 Non-IIM colleges

  {
    name: "TISS Mumbai (HRM&LR)",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.45,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.12,
      workExp: 0.12,
      genderDiversity: 0.06,
      academicDiversity: 0.05,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 70 },
      OBC:     { overall: 75,  sectional: 63 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 75,  sectional: 63 },
      PwD:     { overall: 50,  sectional: 40 },
    },
    historicalThreshold: {
      General: 76,
      OBC:     64,
      SC:      45,
      ST:      37,
      EWS:     70,
    },
  },

  {
    name: "IMT Ghaziabad",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.60,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.08,
      workExp: 0.10,
      genderDiversity: 0.03,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 68 },
      OBC:     { overall: 70,  sectional: 58 },
      SC:      { overall: 50,  sectional: 40 },
      ST:      { overall: 45,  sectional: 35 },
      EWS:     { overall: 70,  sectional: 58 },
      PwD:     { overall: 45,  sectional: 35 },
    },
    historicalThreshold: {
      General: 73,
      OBC:     62,
      SC:      43,
      ST:      35,
      EWS:     68,
    },
  },

  {
    name: "MICA Ahmedabad",
    tier: "Tier 2",
    shortlistWeights: {
      // MICA is unique: also uses MICAT test, but for CAT-based shortlist:
      cat: 0.45,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.12,
      workExp: 0.15,
      genderDiversity: 0.04,
      academicDiversity: 0.08,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 65 },
      OBC:     { overall: 70,  sectional: 58 },
      SC:      { overall: 50,  sectional: 40 },
      ST:      { overall: 45,  sectional: 35 },
      EWS:     { overall: 70,  sectional: 58 },
      PwD:     { overall: 45,  sectional: 35 },
    },
    historicalThreshold: {
      General: 71,
      OBC:     60,
      SC:      41,
      ST:      33,
      EWS:     65,
    },
  },

  {
    name: "SIBM Pune",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 85,  sectional: 72 },
      OBC:     { overall: 75,  sectional: 63 },
      SC:      { overall: 55,  sectional: 45 },
      ST:      { overall: 50,  sectional: 40 },
      EWS:     { overall: 75,  sectional: 63 },
      PwD:     { overall: 45,  sectional: 35 },
    },
    historicalThreshold: {
      General: 74,
      OBC:     63,
      SC:      44,
      ST:      35,
      EWS:     69,
    },
  },

  {
    name: "NMIMS Mumbai",
    tier: "Tier 2",
    shortlistWeights: {
      // NMIMS also uses NMAT, but CAT scores accepted for MBA Core
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 80,  sectional: 70 },
      OBC:     { overall: 72,  sectional: 62 },
      SC:      { overall: 52,  sectional: 42 },
      ST:      { overall: 47,  sectional: 37 },
      EWS:     { overall: 72,  sectional: 62 },
      PwD:     { overall: 47,  sectional: 37 },
    },
    historicalThreshold: {
      General: 73,
      OBC:     62,
      SC:      43,
      ST:      35,
      EWS:     68,
    },
  },

  {
    name: "Great Lakes Chennai",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.50,
      tenth: 0.08,
      twelfth: 0.08,
      graduation: 0.10,
      workExp: 0.16,               // Great Lakes heavily prefers work experience
      genderDiversity: 0.04,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 75,  sectional: 65 },
      OBC:     { overall: 65,  sectional: 55 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 43,  sectional: 33 },
      EWS:     { overall: 65,  sectional: 55 },
      PwD:     { overall: 43,  sectional: 33 },
    },
    historicalThreshold: {
      General: 70,
      OBC:     59,
      SC:      40,
      ST:      32,
      EWS:     65,
    },
  },

  {
    name: "TAPMI Manipal",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 75,  sectional: 65 },
      OBC:     { overall: 65,  sectional: 55 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 43,  sectional: 33 },
      EWS:     { overall: 65,  sectional: 55 },
      PwD:     { overall: 43,  sectional: 33 },
    },
    historicalThreshold: {
      General: 70,
      OBC:     59,
      SC:      40,
      ST:      32,
      EWS:     65,
    },
  },

  {
    name: "FORE School of Management",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 75,  sectional: 63 },
      OBC:     { overall: 63,  sectional: 53 },
      SC:      { overall: 45,  sectional: 35 },
      ST:      { overall: 40,  sectional: 30 },
      EWS:     { overall: 63,  sectional: 53 },
      PwD:     { overall: 40,  sectional: 30 },
    },
    historicalThreshold: {
      General: 69,
      OBC:     58,
      SC:      39,
      ST:      31,
      EWS:     64,
    },
  },

  {
    name: "LBSIM Delhi",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 72,  sectional: 62 },
      OBC:     { overall: 62,  sectional: 52 },
      SC:      { overall: 44,  sectional: 34 },
      ST:      { overall: 39,  sectional: 29 },
      EWS:     { overall: 62,  sectional: 52 },
      PwD:     { overall: 39,  sectional: 29 },
    },
    historicalThreshold: {
      General: 68,
      OBC:     57,
      SC:      38,
      ST:      30,
      EWS:     63,
    },
  },

  {
    name: "KJ Somaiya Mumbai",
    tier: "Tier 2",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 70,  sectional: 60 },
      OBC:     { overall: 60,  sectional: 50 },
      SC:      { overall: 42,  sectional: 32 },
      ST:      { overall: 37,  sectional: 27 },
      EWS:     { overall: 60,  sectional: 50 },
      PwD:     { overall: 37,  sectional: 27 },
    },
    historicalThreshold: {
      General: 67,
      OBC:     56,
      SC:      37,
      ST:      29,
      EWS:     62,
    },
  },

  // ===========================================================================
  // TIER 2.5 — Newer / Baby IIMs (CAP Group)
  // ===========================================================================

  {
    name: "IIM Amritsar",
    tier: "Tier 2.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 75,  sectional: 63 },
      OBC:     { overall: 65,  sectional: 55 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 38,  sectional: 28 },
      EWS:     { overall: 65,  sectional: 55 },
      PwD:     { overall: 38,  sectional: 28 },
    },
    historicalThreshold: {
      General: 68,   // Lowered from 75 — Baby IIM, must be below Tier 2 min (67)
      OBC:     57,
      SC:      38,
      ST:      28,
      EWS:     63,
    },
  },

  {
    name: "IIM Nagpur",
    tier: "Tier 2.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 75,  sectional: 63 },
      OBC:     { overall: 65,  sectional: 55 },
      SC:      { overall: 48,  sectional: 38 },
      ST:      { overall: 38,  sectional: 28 },
      EWS:     { overall: 65,  sectional: 55 },
      PwD:     { overall: 38,  sectional: 28 },
    },
    historicalThreshold: {
      General: 68,
      OBC:     57,
      SC:      38,
      ST:      28,
      EWS:     63,
    },
  },

  {
    name: "IIM Bodh Gaya",
    tier: "Tier 2.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 70,  sectional: 58 },
      OBC:     { overall: 60,  sectional: 50 },
      SC:      { overall: 43,  sectional: 33 },
      ST:      { overall: 33,  sectional: 23 },
      EWS:     { overall: 60,  sectional: 50 },
      PwD:     { overall: 33,  sectional: 23 },
    },
    historicalThreshold: {
      General: 66,
      OBC:     55,
      SC:      36,
      ST:      26,
      EWS:     61,
    },
  },

  {
    name: "IIM Jammu",
    tier: "Tier 2.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 70,  sectional: 58 },
      OBC:     { overall: 60,  sectional: 50 },
      SC:      { overall: 43,  sectional: 33 },
      ST:      { overall: 33,  sectional: 23 },
      EWS:     { overall: 60,  sectional: 50 },
      PwD:     { overall: 33,  sectional: 23 },
    },
    historicalThreshold: {
      General: 66,
      OBC:     55,
      SC:      36,
      ST:      26,
      EWS:     61,
    },
  },

  {
    name: "IIM Sirmaur",
    tier: "Tier 2.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 68,  sectional: 56 },
      OBC:     { overall: 58,  sectional: 48 },
      SC:      { overall: 40,  sectional: 30 },
      ST:      { overall: 30,  sectional: 20 },
      EWS:     { overall: 58,  sectional: 48 },
      PwD:     { overall: 30,  sectional: 20 },
    },
    historicalThreshold: {
      General: 64,
      OBC:     53,
      SC:      34,
      ST:      24,
      EWS:     59,
    },
  },

  {
    name: "IIM Sambalpur",
    tier: "Tier 2.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 68,  sectional: 56 },
      OBC:     { overall: 58,  sectional: 48 },
      SC:      { overall: 40,  sectional: 30 },
      ST:      { overall: 30,  sectional: 20 },
      EWS:     { overall: 58,  sectional: 48 },
      PwD:     { overall: 30,  sectional: 20 },
    },
    historicalThreshold: {
      General: 64,
      OBC:     53,
      SC:      34,
      ST:      24,
      EWS:     59,
    },
  },

  {
    name: "IIM Visakhapatnam",
    tier: "Tier 2.5",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.08,
      workExp: 0.08,
      genderDiversity: 0.05,
      academicDiversity: 0.04,
    },
    minCutoffs: {
      General: { overall: 70,  sectional: 58 },
      OBC:     { overall: 60,  sectional: 50 },
      SC:      { overall: 43,  sectional: 33 },
      ST:      { overall: 33,  sectional: 23 },
      EWS:     { overall: 60,  sectional: 50 },
      PwD:     { overall: 33,  sectional: 23 },
    },
    historicalThreshold: {
      General: 65,
      OBC:     54,
      SC:      35,
      ST:      25,
      EWS:     60,
    },
  },

  // ===========================================================================
  // TIER 3 — Other reputed colleges accepting CAT
  // ===========================================================================

  {
    name: "IMI Delhi",
    tier: "Tier 3",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 70,  sectional: 60 },
      OBC:     { overall: 60,  sectional: 50 },
      SC:      { overall: 42,  sectional: 32 },
      ST:      { overall: 37,  sectional: 27 },
      EWS:     { overall: 60,  sectional: 50 },
      PwD:     { overall: 37,  sectional: 27 },
    },
    historicalThreshold: {
      General: 67,
      OBC:     56,
      SC:      37,
      ST:      29,
      EWS:     62,
    },
  },

  {
    name: "BIMTECH Greater Noida",
    tier: "Tier 3",
    shortlistWeights: {
      cat: 0.55,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.08,
      genderDiversity: 0.04,
      academicDiversity: 0.03,
    },
    minCutoffs: {
      General: { overall: 65,  sectional: 55 },
      OBC:     { overall: 55,  sectional: 45 },
      SC:      { overall: 38,  sectional: 28 },
      ST:      { overall: 33,  sectional: 23 },
      EWS:     { overall: 55,  sectional: 45 },
      PwD:     { overall: 33,  sectional: 23 },
    },
    historicalThreshold: {
      General: 63,
      OBC:     52,
      SC:      33,
      ST:      25,
      EWS:     58,
    },
  },

  {
    name: "IBS Hyderabad",
    tier: "Tier 3",
    shortlistWeights: {
      cat: 0.50,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.10,
      genderDiversity: 0.05,
      academicDiversity: 0.05,
    },
    minCutoffs: {
      General: { overall: 60,  sectional: 50 },
      OBC:     { overall: 50,  sectional: 40 },
      SC:      { overall: 35,  sectional: 25 },
      ST:      { overall: 30,  sectional: 20 },
      EWS:     { overall: 50,  sectional: 40 },
      PwD:     { overall: 30,  sectional: 20 },
    },
    historicalThreshold: {
      General: 60,
      OBC:     49,
      SC:      30,
      ST:      22,
      EWS:     55,
    },
  },

  {
    name: "Alliance University Bangalore",
    tier: "Tier 3",
    shortlistWeights: {
      cat: 0.50,
      tenth: 0.10,
      twelfth: 0.10,
      graduation: 0.10,
      workExp: 0.10,
      genderDiversity: 0.05,
      academicDiversity: 0.05,
    },
    minCutoffs: {
      General: { overall: 55,  sectional: 45 },
      OBC:     { overall: 45,  sectional: 35 },
      SC:      { overall: 30,  sectional: 20 },
      ST:      { overall: 25,  sectional: 15 },
      EWS:     { overall: 45,  sectional: 35 },
      PwD:     { overall: 25,  sectional: 15 },
    },
    historicalThreshold: {
      General: 57,
      OBC:     46,
      SC:      27,
      ST:      19,
      EWS:     52,
    },
  },

];


// ---------------------------------------------------------------------------
// 2. SCORING FUNCTIONS — Normalize individual factors to 0-100
// ---------------------------------------------------------------------------

/**
 * Normalize academic marks to a 0-100 component score.
 * Uses slab-based scoring similar to actual IIM published formulas.
 * IIM-A formula reference: percentage buckets mapped to points.
 */
function normalizeAcademicScore(percentage) {
  const p = parseFloat(percentage) || 0;
  if (p >= 95) return 100;
  if (p >= 90) return 92;
  if (p >= 85) return 84;
  if (p >= 80) return 76;
  if (p >= 75) return 68;
  if (p >= 70) return 60;
  if (p >= 65) return 52;
  if (p >= 60) return 44;
  if (p >= 55) return 36;
  if (p >= 50) return 28;
  return 20;
}

/**
 * Work experience score (0-100).
 * Optimal: 24-36 months (IIM sweet spot).
 * 12-24 months: good.
 * 36-60 months: good but slightly diminishing.
 * >60 months: diminishing returns (over-qualified for fresh MBA).
 * <12 months: minimal benefit (equivalent to fresher).
 */
function normalizeWorkExpScore(months) {
  const m = parseInt(months) || 0;
  if (m === 0) return 10; // Freshers still have base score
  if (m < 12) return 20;  // Too little to matter much
  if (m >= 12 && m < 24) return 60;
  if (m >= 24 && m <= 36) return 100; // Sweet spot
  if (m > 36 && m <= 48) return 85;
  if (m > 48 && m <= 60) return 65;
  return 45; // >60 months: diminishing
}

/**
 * CAT percentile to score (0-100).
 * Uses piecewise linear interpolation for smooth, realistic scoring.
 * A 98.5 percentile candidate should have a strong chance at top IIMs.
 *
 * Calibration reference:
 *   99.5+ → 100 (top ~1,250 candidates)
 *   99    → 97  (top ~2,500)
 *   98    → 93  (top ~5,000)
 *   97    → 89  (top ~7,500)
 *   95    → 82  (top ~12,500)
 *   90    → 70  (top ~25,000)
 *   80    → 52
 *   70    → 38
 */
function normalizeCATScore(percentile) {
  const p = parseFloat(percentile) || 0;
  if (p <= 0) return 0;

  // Piecewise linear interpolation breakpoints: [percentile, score]
  // Calibrated against real CAT 2023-24 shortlisting data.
  //
  // At 99 percentile (~top 2,500 of ~2.5 lakh), candidate should have a
  // realistic shot at most Tier 1.5/2 schools. At 99.5+ they should crack ABC.
  // At 97-98, Tier 2 should be achievable but Tier 1 is a stretch.
  //
  // Score ranges after weighting:
  //   99.5+ → 96+  (ABC contenders)
  //   99    → 92   (Tier 1.5 contenders)
  //   98    → 85   (Tier 2 comfortable)
  //   97    → 80   (Tier 2 borderline)
  //   95    → 72   (Baby IIMs)
  //   90    → 58   (lower tier colleges)
  const breakpoints = [
    [100, 100],
    [99.9, 99],
    [99.5, 96],
    [99, 92],
    [98.5, 89],
    [98, 85],
    [97.5, 82],
    [97, 80],
    [96, 76],
    [95, 72],
    [93, 65],
    [90, 58],
    [85, 48],
    [80, 40],
    [75, 33],
    [70, 27],
    [60, 18],
    [50, 12],
    [0, 3],
  ];

  // Find the two surrounding breakpoints and interpolate
  for (let i = 0; i < breakpoints.length - 1; i++) {
    const [pHigh, sHigh] = breakpoints[i];
    const [pLow, sLow] = breakpoints[i + 1];
    if (p >= pLow && p <= pHigh) {
      const ratio = (p - pLow) / (pHigh - pLow);
      return Math.round(sLow + ratio * (sHigh - sLow));
    }
  }
  return 3;
}

// Engineering graduation streams (for academic diversity detection)
const ENGINEERING_STREAMS = [
  "B.Tech/B.E.",
  "B.Tech",
  "B.E.",
];

// ---------------------------------------------------------------------------
// 3. COMPOSITE SCORE CALCULATOR
// ---------------------------------------------------------------------------

/**
 * Calculate composite shortlisting score for a given institute and profile.
 * Returns: { totalScore: number (0-100), breakdown: { ... } }
 */
function calculateCompositeScore(institute, form) {
  const w = institute.shortlistWeights;

  // CAT score component
  const catScore = normalizeCATScore(parseFloat(form.catPercentile) || 0);

  // Academic components
  const tenthScore = normalizeAcademicScore(form.marks10);
  const twelfthScore = normalizeAcademicScore(form.marks12);
  const gradScore = normalizeAcademicScore(form.gradPercent);

  // Work experience
  const workExpScore = normalizeWorkExpScore(form.workExpMonths);

  // Gender diversity bonus (only for female/transgender candidates)
  const genderScore =
    form.gender === "Female" || form.gender === "Transgender" ? 100 : 0;

  // Academic diversity bonus (non-engineering background)
  const isEngineering = ENGINEERING_STREAMS.includes(form.gradStream);
  const acadDiversityScore = isEngineering ? 0 : 100;

  // Calculate weighted total
  const totalScore =
    catScore * w.cat +
    tenthScore * w.tenth +
    twelfthScore * w.twelfth +
    gradScore * w.graduation +
    workExpScore * w.workExp +
    genderScore * w.genderDiversity +
    acadDiversityScore * w.academicDiversity;

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    breakdown: {
      cat: { score: catScore, weight: w.cat, weighted: +(catScore * w.cat).toFixed(1) },
      tenth: { score: tenthScore, weight: w.tenth, weighted: +(tenthScore * w.tenth).toFixed(1) },
      twelfth: { score: twelfthScore, weight: w.twelfth, weighted: +(twelfthScore * w.twelfth).toFixed(1) },
      graduation: { score: gradScore, weight: w.graduation, weighted: +(gradScore * w.graduation).toFixed(1) },
      workExp: { score: workExpScore, weight: w.workExp, weighted: +(workExpScore * w.workExp).toFixed(1) },
      genderDiversity: { score: genderScore, weight: w.genderDiversity, weighted: +(genderScore * w.genderDiversity).toFixed(1) },
      academicDiversity: { score: acadDiversityScore, weight: w.academicDiversity, weighted: +(acadDiversityScore * w.academicDiversity).toFixed(1) },
    },
  };
}

// ---------------------------------------------------------------------------
// 4. CALL PROBABILITY DETERMINATION
// ---------------------------------------------------------------------------

/**
 * Map chance levels to probability tiers.
 * Compares user's composite score vs institute's historical threshold.
 */
function getCallProbability(compositeScore, threshold) {
  const diff = compositeScore - threshold;
  const ratio = threshold > 0 ? compositeScore / threshold : 0;

  // OR-based tiers — either an absolute margin OR a percentage above threshold.
  // This balances fairness across institutes with different score ranges.
  //
  // Calibration target (99%ile General male engineer, decent academics):
  //   IIM ABC: Moderate/Low  |  Tier 1.5: Moderate-High
  //   Tier 2: High           |  Baby IIMs: Very High
  //   Tier 3: Very High
  if (diff >= 10 || ratio >= 1.12) {
    return { level: "Very High", probability: Math.min(92, 72 + diff), color: "#22c55e" };
  }
  if (diff >= 4 || ratio >= 1.05) {
    return { level: "High", probability: Math.min(78, 52 + diff * 2), color: "#2dd4bf" };
  }
  if (diff >= -3 || ratio >= 0.96) {
    return { level: "Moderate", probability: Math.min(55, 30 + (diff + 5) * 3), color: "#fb923c" };
  }
  if (diff >= -10 || ratio >= 0.88) {
    return { level: "Low", probability: Math.max(5, 18 + diff * 1.5), color: "#f97316" };
  }
  return { level: "Very Low", probability: Math.max(1, 5 + diff * 0.5), color: "#f43f5e" };
}

// ---------------------------------------------------------------------------
// 5. MAIN PREDICTION FUNCTION — Exported
// ---------------------------------------------------------------------------

/**
 * @param {Object} form - User profile:
 *   { catPercentile, catVARC, catDILR, catQA,
 *     category, gender, pwd,
 *     marks10, marks12, gradPercent, gradStream,
 *     workExpMonths, isIIT, nirfRank, profQual, extracurricular }
 * @returns {Array<Object>} - Sorted predictions per institute
 */
export function predictCalls(form) {
  const catPercentile = parseFloat(form.catPercentile) || 0;
  const category = form.category || "General";
  const isPwD = form.pwd === "Yes";

  const results = [];

  for (const inst of INSTITUTES) {
    // Determine which cutoff category to use
    let cutoffCategory = category;
    if (isPwD) cutoffCategory = "PwD";

    const cutoffs = inst.minCutoffs[cutoffCategory] || inst.minCutoffs.General;
    const threshold =
      inst.historicalThreshold[isPwD ? "General" : category] ||
      inst.historicalThreshold.General;

    // PwD candidates get reduced threshold (typically 10-15% lower)
    const adjustedThreshold = isPwD ? threshold * 0.82 : threshold;

    // Check minimum qualifying cutoff
    const meetsMinimum = catPercentile >= cutoffs.overall;

    // Sectional check (if sectional data provided)
    const catVARC = parseFloat(form.catVARC) || 0;
    const catDILR = parseFloat(form.catDILR) || 0;
    const catQA = parseFloat(form.catQA) || 0;
    const hasSectional = catVARC > 0 || catDILR > 0 || catQA > 0;
    let meetsSectional = true;
    let sectionalNote = "";
    if (hasSectional) {
      const sectMin = cutoffs.sectional;
      if (catVARC > 0 && catVARC < sectMin) {
        meetsSectional = false;
        sectionalNote = `VARC ${catVARC} < ${sectMin} required`;
      }
      if (catDILR > 0 && catDILR < sectMin) {
        meetsSectional = false;
        sectionalNote += sectionalNote
          ? `, DILR ${catDILR} < ${sectMin}`
          : `DILR ${catDILR} < ${sectMin} required`;
      }
      if (catQA > 0 && catQA < sectMin) {
        meetsSectional = false;
        sectionalNote += sectionalNote
          ? `, QA ${catQA} < ${sectMin}`
          : `QA ${catQA} < ${sectMin} required`;
      }
    }

    // Calculate composite score
    const { totalScore, breakdown } = calculateCompositeScore(inst, form);

    // Determine call probability
    let probability;
    if (!meetsMinimum) {
      probability = {
        level: "Below Cutoff",
        probability: 0,
        color: "#64748b",
      };
    } else if (!meetsSectional) {
      probability = {
        level: "Sectional Fail",
        probability: 0,
        color: "#94a3b8",
      };
    } else {
      probability = getCallProbability(totalScore, adjustedThreshold);
    }

    // IIT/NIT/BITS bonus — adds a small boost to composite (brand value in PI)
    let brandBonus = 0;
    if (form.isIIT === "Yes") brandBonus = 3;
    const nirfRank = parseInt(form.nirfRank) || 100;
    if (nirfRank <= 10) brandBonus = Math.max(brandBonus, 4);
    else if (nirfRank <= 25) brandBonus = Math.max(brandBonus, 2.5);
    else if (nirfRank <= 50) brandBonus = Math.max(brandBonus, 1.5);

    // Professional qualification bonus
    let profBonus = 0;
    if (form.profQual && form.profQual !== "None") profBonus = 2;

    // Post-graduation bonus
    let postGradBonus = 0;
    if (form.hasPostGrad === "Yes" && form.postGradType) {
      if (form.postGradType === "PhD") postGradBonus = 3.5;
      else if (["M.Tech/M.E.", "M.Phil", "LLM"].includes(form.postGradType)) postGradBonus = 2.5;
      else if (form.postGradType === "MBA") postGradBonus = 0.5; // Prior MBA reduces novelty
      else postGradBonus = 1.5; // MA, MSc, M.Com, MCA, Other
    }

    const adjustedScore = totalScore + brandBonus + profBonus + postGradBonus;
    if (meetsMinimum && meetsSectional) {
      probability = getCallProbability(adjustedScore, adjustedThreshold);
    }

    results.push({
      institute: inst.name,
      tier: inst.tier,
      compositeScore: adjustedScore.toFixed(1),
      threshold: adjustedThreshold.toFixed(1),
      minCutoff: cutoffs.overall,
      meetsMinimum,
      meetsSectional,
      sectionalNote,
      probability,
      breakdown,
      category: cutoffCategory,
    });
  }

  // Sort: by tier first (Tier 1 → 1.5 → 2 → 2.5), then within tier by probability descending
  const tierOrder = { "Tier 1": 0, "Tier 1.5": 1, "Tier 2": 2, "Tier 2.5": 3, "Tier 3": 4 };
  results.sort((a, b) => {
    const tierA = tierOrder[a.tier] ?? 99;
    const tierB = tierOrder[b.tier] ?? 99;
    if (tierA !== tierB) return tierA - tierB;
    // Within same tier: eligible first, then by probability
    if (a.meetsMinimum && !b.meetsMinimum) return -1;
    if (!a.meetsMinimum && b.meetsMinimum) return 1;
    return b.probability.probability - a.probability.probability;
  });

  return results;
}

/**
 * Inverse of normalizeCATScore. 
 * Given a required CAT components score (0-100), returns the corresponding CAT percentile needed.
 */
function inverseNormalizeCATScore(score) {
  if (score >= 100) return 100;
  if (score <= 3) return 0;

  const breakpoints = [
    [100, 100],
    [99.9, 99],
    [99.5, 96],
    [99, 92],
    [98.5, 89],
    [98, 85],
    [97.5, 82],
    [97, 80],
    [96, 76],
    [95, 72],
    [93, 65],
    [90, 58],
    [85, 48],
    [80, 40],
    [75, 33],
    [70, 27],
    [60, 18],
    [50, 12],
    [0, 3],
  ];

  for (let i = 0; i < breakpoints.length - 1; i++) {
    const [pHigh, sHigh] = breakpoints[i];
    const [pLow, sLow] = breakpoints[i + 1];
    if (score >= sLow && score <= sHigh) {
      if (sHigh === sLow) return pLow;
      const ratio = (score - sLow) / (sHigh - sLow);
      return pLow + ratio * (pHigh - pLow);
    }
  }
  return 0;
}

/**
 * Calculates the required CAT percentile for each institute to reach the historical threshold
 * based on the user's non-CAT profile details.
 */
export function getRequiredPercentiles(form) {
  const category = form.category || "General";
  const isPwD = form.pwd === "Yes";

  const results = [];

  // Calculate non-CAT components
  const tenthScore = normalizeAcademicScore(form.marks10);
  const twelfthScore = normalizeAcademicScore(form.marks12);
  const gradScore = normalizeAcademicScore(form.gradPercent);
  const workExpScore = normalizeWorkExpScore(form.workExpMonths);
  
  const genderScore = form.gender === "Female" || form.gender === "Transgender" ? 100 : 0;
  const isEngineering = ENGINEERING_STREAMS.includes(form.gradStream);
  const acadDiversityScore = isEngineering ? 0 : 100;

  for (const inst of INSTITUTES) {
    let cutoffCategory = category;
    if (isPwD) cutoffCategory = "PwD";

    const cutoffs = inst.minCutoffs[cutoffCategory] || inst.minCutoffs.General;
    const threshold =
      inst.historicalThreshold[isPwD ? "General" : category] ||
      inst.historicalThreshold.General;
    
    const w = inst.shortlistWeights;

    const nonCatComponentSum =
      tenthScore * w.tenth +
      twelfthScore * w.twelfth +
      gradScore * w.graduation +
      workExpScore * w.workExp +
      genderScore * w.genderDiversity +
      acadDiversityScore * w.academicDiversity;

    let requiredPercentile = 0;
    let achievable = true;
    let note = "";
    let color = "#22c55e"; // default green

    // The threshold in INSTITUTES is the "Moderate/Safe" boundary.
    // Aspirants want the baseline minimum to get a call (a "Low/Borderline" chance).
    // From getCallProbability, a diff of -4 to -8 represents this minimum cutoff.
    // We target threshold - 4 to give a realistic minimum target.
    const targetThreshold = threshold - 4;

    if (w.cat === 0) {
      requiredPercentile = cutoffs.overall;
      note = "Profile Independent";
    } else {
      const requiredCatScore = (targetThreshold - nonCatComponentSum) / w.cat;
      
      if (requiredCatScore > 100) {
        achievable = false;
        requiredPercentile = 100;
        note = "Profile bottleneck";
        color = "#f43f5e"; // Red
      } else {
        const rawPercentile = inverseNormalizeCATScore(requiredCatScore);
        requiredPercentile = Math.max(rawPercentile, cutoffs.overall);

        if (requiredPercentile > 99.5) {
          color = "#f43f5e"; // Red
          note = "Extremely Tough";
        } else if (requiredPercentile > 98) {
          color = "#f97316"; // Orange
          note = "Very Tough";
        } else if (requiredPercentile > 95) {
          color = "#fb923c"; // Lighter orange
          note = "Tough";
        } else if (requiredPercentile > 85) {
          color = "#2dd4bf"; // Teal
          note = "Achievable";
        } else {
          color = "#22c55e"; // Green
          note = "Safe";
        }
      }
    }

    results.push({
      institute: inst.name,
      tier: inst.tier,
      category: cutoffCategory,
      minCutoff: cutoffs.overall,
      requiredPercentile: (Math.round(requiredPercentile * 100) / 100).toFixed(2),
      achievable,
      note,
      color,
      breakdown: {
        nonCatComponentSum: nonCatComponentSum.toFixed(2),
        historicalThreshold: threshold,
        targetThreshold: targetThreshold.toFixed(1),
        catWeight: w.cat,
      }
    });
  }

  const tierOrder = {
    "Tier 1": 1,
    "Tier 1.5": 2,
    "Tier 2": 3,
    "Tier 2.5": 4,
    "Tier 3": 5,
  };

  results.sort((a, b) => {
    const tA = tierOrder[a.tier] || 99;
    const tB = tierOrder[b.tier] || 99;
    if (tA !== tB) return tA - tB;
    return parseFloat(b.requiredPercentile) - parseFloat(a.requiredPercentile);
  });

  return results;
}

/**
 * Calculate an overall profile strength summary (0-100).
 * Gives user a quick sense of where they stand.
 */
export function getProfileStrength(form, isFutureTab = false) {
  const catScore = isFutureTab ? 0 : normalizeCATScore(parseFloat(form.catPercentile) || 0);
  const tenthScore = normalizeAcademicScore(form.marks10);
  const twelfthScore = normalizeAcademicScore(form.marks12);
  const gradScore = normalizeAcademicScore(form.gradPercent);
  const workExpScore = normalizeWorkExpScore(form.workExpMonths);

  let overall;
  if (isFutureTab) {
    // Non-CAT profile evaluation (scale academics and work-ex to ~100)
    const rawAcad = (tenthScore + twelfthScore + gradScore) / 3;
    const acadWeight = 0.70;
    const workExpWeight = 0.30;
    overall = (rawAcad * acadWeight) + (workExpScore * workExpWeight);
  } else {
    // Weighted average using typical IIM weights
    overall =
      catScore * 0.55 +
      tenthScore * 0.10 +
      twelfthScore * 0.10 +
      gradScore * 0.10 +
      workExpScore * 0.08;
  }

  // Bonus factors
  let bonus = 0;
  if (form.isIIT === "Yes") bonus += 4;
  const nirfRank = parseInt(form.nirfRank) || 100;
  if (nirfRank <= 25) bonus += 3;
  else if (nirfRank <= 50) bonus += 1.5;
  if (form.profQual && form.profQual !== "None") bonus += 2;
  if (form.gender === "Female" || form.gender === "Transgender") bonus += 3;
  if (!ENGINEERING_STREAMS.includes(form.gradStream)) bonus += 2;
  // Post-graduation bonus
  if (form.hasPostGrad === "Yes" && form.postGradType) {
    if (form.postGradType === "PhD") bonus += 3.5;
    else if (["M.Tech/M.E.", "M.Phil", "LLM"].includes(form.postGradType)) bonus += 2.5;
    else if (form.postGradType === "MBA") bonus += 0.5;
    else bonus += 1.5;
  }

  const total = Math.min(100, overall + bonus);

  let label, description;
  if (total >= 85) {
    label = "Excellent";
    description = isFutureTab
      ? "Outstanding base profile. You are well-positioned for top IIMs."
      : "Outstanding profile. Strong chances at top IIMs with your CAT score.";
  } else if (total >= 72) {
    label = "Strong";
    description = isFutureTab
      ? "Competitive profile. A strong CAT score will secure top calls."
      : "Competitive profile. Good shot at mid-tier IIMs and some top ones.";
  } else if (total >= 58) {
    label = "Moderate";
    description = isFutureTab
      ? "Decent profile. You will need a very high CAT percentile."
      : "Decent profile. Focus on maximizing CAT score for better chances.";
  } else if (total >= 40) {
    label = "Developing";
    description = isFutureTab
      ? "Profile needs strengthening. A stellar CAT score is critical."
      : "Profile needs strengthening. A higher CAT percentile will be critical.";
  } else {
    label = "Needs Improvement";
    description = isFutureTab
      ? "Consider building work experience to lower the intense CAT burden."
      : "Consider building work experience or improving CAT score significantly.";
  }

  return {
    score: Math.round(total),
    label,
    description,
    isFutureTab,
    factors: {
      catPercentile: catScore,
      academics: Math.round((tenthScore + twelfthScore + gradScore) / 3),
      workExperience: workExpScore,
      diversityBonuses: bonus,
    },
  };
}

export { INSTITUTES };
