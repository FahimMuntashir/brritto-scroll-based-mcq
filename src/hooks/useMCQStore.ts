import { useState, useCallback, useRef, useEffect } from 'react';
import { MCQuestion, UserAnswer, FilterState, SessionStats } from '@/types/mcq';
import { sampleQuestions } from '@/data/questions';

const QUESTIONS_PER_PAGE = 10;

export function useMCQStore() {
  const [questions] = useState<MCQuestion[]>(sampleQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const [favourites, setFavourites] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    showOptions: false,
    showAnswer: false,
    showExplanation: false,
    showAnalytics: false,
    showAllAnswers: false,
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionActive, setSessionActive] = useState(true);
  const [sessionStartTime] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  const filteredQuestions = searchQuery
    ? questions.filter(q =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const selectAnswer = useCallback((questionId: number, optionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    const option = question.options.find(o => o.id === optionId);
    if (!option) return;

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOptionId: optionId,
        isCorrect: option.isCorrect,
        isSkipped: false,
        timestamp: Date.now(),
      },
    }));

    if (soundEnabled) {
      playSound(option.isCorrect);
    }
  }, [questions, soundEnabled]);

  const skipQuestion = useCallback((questionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOptionId: null,
        isCorrect: null,
        isSkipped: true,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const toggleFavourite = useCallback((questionId: number) => {
    setFavourites(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const updateFilter = useCallback((key: keyof FilterState, value: boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const getSessionStats = useCallback((): SessionStats => {
    const answered = Object.values(answers);
    const correct = answered.filter(a => a.isCorrect === true).length;
    const wrong = answered.filter(a => a.isCorrect === false).length;
    const skipped = answered.filter(a => a.isSkipped).length;

    const subjectBreakdown: SessionStats['subjectBreakdown'] = {};
    answered.forEach(a => {
      const q = questions.find(q => q.id === a.questionId);
      if (!q) return;
      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { attempted: 0, correct: 0, wrong: 0 };
      }
      subjectBreakdown[q.subject].attempted++;
      if (a.isCorrect) subjectBreakdown[q.subject].correct++;
      if (a.isCorrect === false && !a.isSkipped) subjectBreakdown[q.subject].wrong++;
    });

    return {
      totalAttempted: answered.length,
      correct,
      wrong,
      skipped,
      timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000),
      subjectBreakdown,
    };
  }, [answers, questions, sessionStartTime]);

  const getMistakes = useCallback(() => {
    return Object.values(answers)
      .filter(a => a.isCorrect === false && !a.isSkipped)
      .map(a => questions.find(q => q.id === a.questionId)!)
      .filter(Boolean);
  }, [answers, questions]);

  const getFavouriteQuestions = useCallback(() => {
    return questions.filter(q => favourites.has(q.id));
  }, [questions, favourites]);

  return {
    questions: filteredQuestions,
    paginatedQuestions,
    currentPage,
    totalPages: Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE),
    setCurrentPage,
    answers,
    selectAnswer,
    skipQuestion,
    favourites,
    toggleFavourite,
    filters,
    updateFilter,
    soundEnabled,
    setSoundEnabled,
    sessionActive,
    setSessionActive,
    searchQuery,
    setSearchQuery,
    getSessionStats,
    getMistakes,
    getFavouriteQuestions,
  };
}

function playSound(correct: boolean) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = correct ? 800 : 300;
    osc.type = correct ? 'sine' : 'square';
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore audio errors on unsupported browsers or restricted environments.
  }
}
