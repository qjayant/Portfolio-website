import { Award, Zap, BookOpen, Target, Star } from 'lucide-react';

export const BADGES = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Completed your first study task',
    icon: Star,
    color: '#fbbf24',
    condition: (progress) => progress.completedCount >= 1
  },
  {
    id: 'streak_3',
    name: 'Consistency Is Key',
    description: 'Maintained a 3-day study streak',
    icon: Zap,
    color: '#f43f5e',
    condition: (progress) => progress.streak >= 3
  },
  {
    id: 'half_way',
    name: 'Half Way There',
    description: 'Completed 50% of the syllabus',
    icon: Target,
    color: '#3b82f6',
    condition: (progress, total) => (progress.completedCount / total) >= 0.5
  },
  {
    id: 'qa_master',
    name: 'Quant Wizard',
    description: 'Completed 10 QA topics',
    icon: BookOpen,
    color: '#8b5cf6',
    condition: (progress) => progress.subjectCounts?.QA >= 10
  }
];
