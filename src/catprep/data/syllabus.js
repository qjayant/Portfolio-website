// ==========================================================================
// CAT SYLLABUS — Based on Last 15 Years CAT Paper Analysis (2010–2024)
// ==========================================================================
// priority: 'P1' (Must Do for ALL students), 'P2' (Should Do for 90%+), 'P3' (Optional, 99% only)
// catWeightage: approximate % of questions from this topic within its section
// avgQuestions: typical number of questions per CAT paper from this topic
// ==========================================================================

export const SYLLABUS = {

  // =============================================
  // VARC — 24 Questions | ~40% of total score
  // RC = 16 Qs (Non-negotiable), VA = 8 Qs
  // =============================================
  VARC: [
    {
      id: 'varc_rc_abstract',
      topic: 'RC: Abstract & Philosophy Passages',
      weight: 'high',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 21,
      avgQuestions: '4-5',
      subtopics: ['Identifying abstract arguments & counter-arguments', 'Decoding philosophical reasoning', 'Inference from dense text', 'Tone analysis in abstract writing']
    },
    {
      id: 'varc_rc_business',
      topic: 'RC: Business & Economy Passages',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 17,
      avgQuestions: '3-4',
      subtopics: ['Extracting data-driven conclusions', 'Author\'s stance on economic policies', 'Fact vs Opinion identification', 'Business case comprehension']
    },
    {
      id: 'varc_rc_science',
      topic: 'RC: Science & Technology Passages',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 15,
      avgQuestions: '3-4',
      subtopics: ['Understanding scientific methodology in text', 'Cause-effect identification', 'Technical vocabulary in context', 'Data interpretation within passages']
    },
    {
      id: 'varc_rc_social',
      topic: 'RC: Social & Political Passages',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 10,
      avgQuestions: '2-3',
      subtopics: ['Identifying author bias & perspective', 'Historical context comprehension', 'Argument structure analysis']
    },
    {
      id: 'varc_pj',
      topic: 'Para Jumbles (TITA)',
      weight: 'high',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 13,
      avgQuestions: '3',
      subtopics: ['4-sentence TITA ordering', '5-sentence ordering', 'Identifying opening & closing sentences', 'Logical flow & connector analysis']
    },
    {
      id: 'varc_summary',
      topic: 'Para Summary',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 8,
      avgQuestions: '2',
      subtopics: ['Distilling core argument', 'Eliminating extreme/partial options', 'Scope matching technique']
    },
    {
      id: 'varc_odd',
      topic: 'Odd Sentence Out (TITA)',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P2',
      catWeightage: 8,
      avgQuestions: '2',
      subtopics: ['Theme coherence checking', 'Identifying thematic outliers', 'Scope & context mismatch detection']
    },
    {
      id: 'varc_completion',
      topic: 'Para Completion',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P2',
      catWeightage: 4,
      avgQuestions: '1',
      subtopics: ['Logical continuation identification', 'Tone consistency analysis']
    }
  ],

  // =============================================
  // DILR — 20 Questions | ~30% of total score
  // 4 sets × 5 questions each. Set selection is key.
  // =============================================
  DILR: [
    // --- DATA INTERPRETATION (~10 Qs) ---
    {
      id: 'dilr_tables',
      topic: 'DI: Tables',
      weight: 'high',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 15,
      avgQuestions: '3-5',
      subtopics: ['Reading & extracting data from tables', 'Percentage change calculations', 'Growth rate analysis', 'Missing data inference']
    },
    {
      id: 'dilr_bar',
      topic: 'DI: Bar Graphs',
      weight: 'high',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 13,
      avgQuestions: '3-5',
      subtopics: ['Stacked bar interpretation', 'Comparative analysis', 'Trend extraction', 'Combined bar-table sets']
    },
    {
      id: 'dilr_line',
      topic: 'DI: Line Graphs',
      weight: 'high',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 10,
      avgQuestions: '2-4',
      subtopics: ['Multi-line comparison', 'Rate of change analysis', 'Intersection & crossover points']
    },
    {
      id: 'dilr_pie',
      topic: 'DI: Pie Charts',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 7,
      avgQuestions: '2-4',
      subtopics: ['Degree-to-value conversion', 'Multi-pie comparison', 'Sector ratio calculations']
    },
    {
      id: 'dilr_caselets',
      topic: 'DI: Caselets (Text-Based DI)',
      weight: 'high',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 10,
      avgQuestions: '3-5',
      subtopics: ['Converting text to tables/charts', 'Variable identification from paragraphs', 'Multi-step calculation sets']
    },
    {
      id: 'dilr_mixed',
      topic: 'DI: Mixed Charts',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P2',
      catWeightage: 5,
      avgQuestions: '2-3',
      subtopics: ['Cross-referencing multiple chart types', 'Data synthesis from heterogeneous sources']
    },
    // --- LOGICAL REASONING (~10 Qs) ---
    {
      id: 'dilr_seating',
      topic: 'LR: Seating Arrangements',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 12,
      avgQuestions: '3-5',
      subtopics: ['Linear single-row arrangements', 'Circular facing center/outward', 'Double-row arrangements', 'Complex multi-constraint seating']
    },
    {
      id: 'dilr_scheduling',
      topic: 'LR: Scheduling & Timetables',
      weight: 'high',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 8,
      avgQuestions: '3-5',
      subtopics: ['Slot-based scheduling', 'Constraint satisfaction', 'Ordering with conditions', 'Multi-day timetable construction']
    },
    {
      id: 'dilr_games',
      topic: 'LR: Games & Tournaments',
      weight: 'high',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 8,
      avgQuestions: '3-5',
      subtopics: ['Knockout tournament logic', 'Round Robin scoring', 'Ranking & placement', 'Points-based elimination']
    },
    {
      id: 'dilr_binary',
      topic: 'LR: Binary Logic (True/False)',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '3-5',
      subtopics: ['Truth-teller/Liar identification', 'Matrix-based binary deduction', 'Yes/No constraint grids']
    },
    {
      id: 'dilr_networks',
      topic: 'LR: Networks & Routes',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P2',
      catWeightage: 4,
      avgQuestions: '2-4',
      subtopics: ['Shortest path problems', 'Flow optimization', 'Connection/graph-based reasoning']
    },
    {
      id: 'dilr_venn',
      topic: 'LR: Venn Diagrams',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P2',
      catWeightage: 5,
      avgQuestions: '2-3',
      subtopics: ['2 & 3 set Venn problems', 'Maxima/Minima in Venn regions', 'Data-driven Venn construction']
    },
    {
      id: 'dilr_teams',
      topic: 'LR: Team Selection',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P2',
      catWeightage: 3,
      avgQuestions: '2-3',
      subtopics: ['Conditional team formation', 'Inclusion/exclusion constraints', 'Matching & allocation']
    }
  ],

  // =============================================
  // QA — 22 Questions | ~30% of total score
  // Arithmetic + Algebra = 55-60% of QA. Master these first.
  // =============================================
  QA: [
    // --- ARITHMETIC (8-10 Qs) — HIGHEST PRIORITY ---
    {
      id: 'qa_ratio',
      topic: 'Ratio, Proportion & Variation',
      weight: 'high',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 11,
      avgQuestions: '2-3',
      subtopics: ['Ratio properties & operations', 'Direct & Inverse proportion', 'Partnerships & profit sharing', 'Variation problems']
    },
    {
      id: 'qa_percent',
      topic: 'Percentages',
      weight: 'high',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 11,
      avgQuestions: '2-3',
      subtopics: ['Basic percentage calculations', 'Successive percentage changes', 'Percentage-fraction conversions', 'Population/depreciation problems']
    },
    {
      id: 'qa_pnl',
      topic: 'Profit, Loss & Discount',
      weight: 'high',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 7,
      avgQuestions: '1-2',
      subtopics: ['Markup & discount calculations', 'Successive discounts', 'Dishonest dealer problems', 'CP-SP relationship chains']
    },
    {
      id: 'qa_tsd',
      topic: 'Time, Speed & Distance',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 11,
      avgQuestions: '2-3',
      subtopics: ['Average speed & relative speed', 'Trains & platforms', 'Boats & streams', 'Circular motion & races']
    },
    {
      id: 'qa_tw',
      topic: 'Time & Work',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 7,
      avgQuestions: '1-2',
      subtopics: ['Efficiency-based problems', 'Pipes & cisterns', 'Man-days concept', 'Work & wages']
    },
    {
      id: 'qa_mix',
      topic: 'Mixtures & Alligations',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['Alligation rule application', 'Repeated dilution/replacement', 'Mixture ratio problems']
    },
    {
      id: 'qa_interest',
      topic: 'Simple & Compound Interest',
      weight: 'medium',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 3,
      avgQuestions: '1',
      subtopics: ['SI vs CI difference formula', 'Installment calculations', 'Effective rate of interest']
    },
    {
      id: 'qa_avg',
      topic: 'Averages & Weighted Average',
      weight: 'high',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['Simple & weighted averages', 'Average of groups (joining/leaving)', 'Median & mode basics']
    },
    // --- ALGEBRA (5-7 Qs) — HIGHEST PRIORITY ---
    {
      id: 'qa_equations',
      topic: 'Linear & Quadratic Equations',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 9,
      avgQuestions: '2-3',
      subtopics: ['Solving linear equations', 'Quadratic roots & discriminant', 'Word problems to equations', 'Systems of equations']
    },
    {
      id: 'qa_functions',
      topic: 'Functions & Graphs',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['Domain & range', 'Composite & inverse functions', 'Maxima & Minima', 'Graph interpretation']
    },
    {
      id: 'qa_inequalities',
      topic: 'Inequalities',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['Linear inequalities', 'Quadratic inequalities', 'Modulus-based inequalities', 'Graphical solutions']
    },
    {
      id: 'qa_logs',
      topic: 'Logarithms',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 3,
      avgQuestions: '1-2',
      subtopics: ['Log rules & properties', 'Change of base', 'Log equations & inequalities']
    },
    {
      id: 'qa_progressions',
      topic: 'Progressions (AP, GP, HP)',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['AP sum & nth term', 'GP sum & infinite GP', 'HP basics & harmonic mean', 'Series-based word problems']
    },
    {
      id: 'qa_polynomials',
      topic: 'Polynomials',
      weight: 'low',
      difficulty: 'hard',
      priority: 'P2',
      catWeightage: 2,
      avgQuestions: '1',
      subtopics: ['Factor & remainder theorem', 'Polynomial roots relationship']
    },
    // --- GEOMETRY & MENSURATION (4-6 Qs) ---
    {
      id: 'qa_triangles',
      topic: 'Triangles (Similarity & Congruency)',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['Similarity & congruency theorems', 'Pythagoras applications', 'Area by coordinates/heron', 'Special triangles (30-60-90, 45-45-90)']
    },
    {
      id: 'qa_circles',
      topic: 'Circles (Chords & Tangents)',
      weight: 'high',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['Chord properties & intersections', 'Tangent theorems', 'Cyclic quadrilaterals', 'Common tangent problems']
    },
    {
      id: 'qa_coordinate',
      topic: 'Coordinate Geometry',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P2',
      catWeightage: 3,
      avgQuestions: '1-2',
      subtopics: ['Distance & section formula', 'Equation of lines', 'Area of polygons on coordinate plane']
    },
    {
      id: 'qa_mensuration',
      topic: 'Mensuration (2D & 3D)',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 4,
      avgQuestions: '1-2',
      subtopics: ['Area & perimeter of 2D shapes', 'Volume & surface area of 3D solids', 'Frustum & combined solids']
    },
    {
      id: 'qa_quadrilaterals',
      topic: 'Quadrilaterals & Polygons',
      weight: 'low',
      difficulty: 'medium',
      priority: 'P2',
      catWeightage: 2,
      avgQuestions: '1',
      subtopics: ['Interior & exterior angle sums', 'Properties of special quadrilaterals']
    },
    {
      id: 'qa_trigo',
      topic: 'Trigonometry (Basics)',
      weight: 'low',
      difficulty: 'hard',
      priority: 'P3',
      catWeightage: 1,
      avgQuestions: '0-1',
      subtopics: ['Basic trig ratios & identities', 'Heights & distances']
    },
    // --- NUMBER THEORY (3-5 Qs) ---
    {
      id: 'qa_divisibility',
      topic: 'Divisibility & Remainders',
      weight: 'high',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 5,
      avgQuestions: '1-2',
      subtopics: ['Divisibility rules (2-11)', 'Remainder theorems', 'Euler & Fermat theorems', 'Chinese remainder theorem basics']
    },
    {
      id: 'qa_hcf_lcm',
      topic: 'HCF & LCM',
      weight: 'medium',
      difficulty: 'easy',
      priority: 'P1',
      catWeightage: 3,
      avgQuestions: '1',
      subtopics: ['Prime factorization method', 'HCF/LCM of fractions', 'Word problems on HCF/LCM']
    },
    {
      id: 'qa_factorials',
      topic: 'Factorials & Trailing Zeros',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 3,
      avgQuestions: '1',
      subtopics: ['Highest power in n!', 'Trailing zeros calculation', 'Factorial-based divisibility']
    },
    {
      id: 'qa_units',
      topic: 'Units Digit & Cyclicity',
      weight: 'medium',
      difficulty: 'medium',
      priority: 'P1',
      catWeightage: 3,
      avgQuestions: '1',
      subtopics: ['Power cyclicity patterns', 'Last digit of large powers', 'Units digit in products/sums']
    },
    {
      id: 'qa_base',
      topic: 'Base System',
      weight: 'low',
      difficulty: 'hard',
      priority: 'P3',
      catWeightage: 1,
      avgQuestions: '0-1',
      subtopics: ['Base conversion techniques', 'Arithmetic in different bases']
    },
    {
      id: 'qa_primes',
      topic: 'Prime Numbers',
      weight: 'low',
      difficulty: 'medium',
      priority: 'P2',
      catWeightage: 2,
      avgQuestions: '0-1',
      subtopics: ['Prime identification & properties', 'Number of factors formula', 'Sum & product of factors']
    },
    // --- MODERN MATH (2-4 Qs) ---
    {
      id: 'qa_pnc',
      topic: 'Permutation & Combination',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P1',
      catWeightage: 4,
      avgQuestions: '1-2',
      subtopics: ['Fundamental counting principle', 'Permutation with restrictions', 'Combination with conditions', 'Circular permutations']
    },
    {
      id: 'qa_probability',
      topic: 'Probability',
      weight: 'medium',
      difficulty: 'hard',
      priority: 'P2',
      catWeightage: 3,
      avgQuestions: '1-2',
      subtopics: ['Basic probability', 'Conditional probability', 'Bayes theorem basics', 'Expected value problems']
    },
    {
      id: 'qa_sets',
      topic: 'Set Theory',
      weight: 'low',
      difficulty: 'medium',
      priority: 'P2',
      catWeightage: 2,
      avgQuestions: '1',
      subtopics: ['Union, intersection, complement', 'Maxima/Minima in sets', 'Venn diagram word problems']
    },
    {
      id: 'qa_surds',
      topic: 'Surds & Indices',
      weight: 'low',
      difficulty: 'medium',
      priority: 'P2',
      catWeightage: 2,
      avgQuestions: '1',
      subtopics: ['Laws of indices', 'Rationalization of surds', 'Simplification problems']
    }
  ]
};
