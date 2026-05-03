/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProgress {
  uid: string;
  xp: number;
  level: number;
  badges: string[];
  solvedCount: number;
  quizScores: { [quizId: string]: number };
  lastDailyChallenge: string | null;
  streak: number;
}

export interface StudyTask {
  id: string;
  title: string;
  day: number; // 0-6 (Sun-Sat)
  time: string;
  completed: boolean;
  color: string;
}

export interface MathFormula {
  id: string;
  category: string;
  title: string;
  formula: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  questions: QuizQuestion[];
}
