export interface MCQOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQuestion {
  id: number;
  subject: string;
  text: string;
  options: MCQOption[];
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  analytics: {
    correctPercent: number;
    wrongPercent: number;
    totalAttempts: number;
    avgTime: number;
  };
}

export interface UserAnswer {
  questionId: number;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  isSkipped: boolean;
  timestamp: number;
}

export interface SessionStats {
  totalAttempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeSpent: number; // seconds
  subjectBreakdown: Record<string, { attempted: number; correct: number; wrong: number }>;
}

export interface FilterState {
  showOptions: boolean;
  showAnswer: boolean;
  showExplanation: boolean;
  showAnalytics: boolean;
  showAllAnswers: boolean;
}
