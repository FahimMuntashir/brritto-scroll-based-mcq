import { MCQuestion, UserAnswer, FilterState } from '@/types/mcq';
import { Bookmark, SkipForward, Volume2, ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface QuestionCardProps {
  question: MCQuestion;
  answer?: UserAnswer;
  filters: FilterState;
  isFavourite: boolean;
  onSelectOption: (optionId: string) => void;
  onSkip: () => void;
  onToggleFavourite: () => void;
  onSpeak: () => void;
  onDoubt: () => void;
  showAllAnswers: boolean;
}

const QuestionCard = ({
  question, answer, filters, isFavourite,
  onSelectOption, onSkip, onToggleFavourite, onSpeak, onDoubt, showAllAnswers,
}: QuestionCardProps) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const hasAnswered = !!answer && !answer.isSkipped;

  useEffect(() => {
    setOptionsOpen(false);
    setExplanationOpen(false);
    setAnalyticsOpen(false);
    setAnswerRevealed(false);
  }, [question.id]);

  const analyticsNeedsOptions = filters.showAnalytics && (filters.showAnswer || filters.showExplanation);
  const baseShowOptions = filters.showOptions || analyticsNeedsOptions;
  const baseShowAnswer = filters.showAnswer || filters.showExplanation;
  const showOptions = showAllAnswers || baseShowOptions || optionsOpen || hasAnswered;
  const showAnswer = showAllAnswers || baseShowAnswer || answerRevealed;
  const showExplanation = filters.showExplanation || explanationOpen;
  const showAnalytics = filters.showAnalytics || analyticsOpen;
  const correctOnlyAutoReveal = filters.showAnalytics && filters.showOptions && !filters.showAnswer && !filters.showExplanation;
  const canRevealExplanation = !showExplanation && (showAnswer || hasAnswered);
  const canRevealAnalytics = !showAnalytics && (showAnswer || hasAnswered || showExplanation);
  const optionAttemptData = getOptionAttemptData(question);

  const getOptionStyle = (optionId: string, isCorrect: boolean) => {
    if (!showAnswer && !hasAnswered && !showAllAnswers) return 'border-border bg-card hover:bg-muted/50';
    if (showAllAnswers && isCorrect) return 'border-success bg-success/10';
    if (!hasAnswered && showAnswer && isCorrect) return 'border-success bg-success/10';
    if (!hasAnswered) return 'border-border bg-card';
    if (answer?.selectedOptionId === optionId) {
      return answer.isCorrect
        ? 'border-success bg-success/10'
        : 'border-destructive bg-destructive/10';
    }
    if (isCorrect) return 'border-success bg-success/10';
    return 'border-border bg-card opacity-60';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      {/* Question header */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Q {question.id}. <span className="text-primary/80">{question.subject}</span>
        </span>
        <div className="flex items-center gap-1">
          <button onClick={onSpeak} className="p-1.5 rounded-md hover:bg-muted transition-colors">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={onToggleFavourite} className="p-1.5 rounded-md hover:bg-muted transition-colors">
            <Bookmark className={`w-4 h-4 ${isFavourite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>

      {/* Question text */}
      <p className="text-sm font-medium text-foreground leading-relaxed mb-4">{question.text}</p>

      {showAnswer && !showOptions && (
        <div className="mb-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm">
          <span className="font-semibold text-success">Answer: </span>
          <span className="font-medium text-foreground">
            {question.options.find(opt => opt.isCorrect)?.label}. {question.options.find(opt => opt.isCorrect)?.text}
          </span>
        </div>
      )}

      {!showOptions && (
        <div className="mb-3">
          <button
            onClick={() => setOptionsOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Show Options
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Options */}
      {showOptions && (
        <div className="space-y-2 mb-3">
          {question.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                if (hasAnswered || showAllAnswers) return;
                setOptionsOpen(true);
                if (!correctOnlyAutoReveal || opt.isCorrect) {
                  setAnswerRevealed(true);
                }
                onSelectOption(opt.id);
              }}
              disabled={hasAnswered || showAllAnswers}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${getOptionStyle(opt.id, opt.isCorrect)} ${
                !hasAnswered && !showAllAnswers ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
              }`}
            >
              <span className="font-semibold text-muted-foreground mr-2">{opt.label}.</span>
              <span className="text-foreground">{opt.text}</span>
              {(hasAnswered || showAllAnswers) && opt.isCorrect && (
                <span className="ml-2 text-xs text-success font-medium">✓</span>
              )}
              {hasAnswered && answer?.selectedOptionId === opt.id && !opt.isCorrect && (
                <span className="ml-2 text-xs text-destructive font-medium">✗</span>
              )}
            </button>
          ))}
        </div>
      )}

      {canRevealExplanation || canRevealAnalytics ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {canRevealExplanation && (
            <button
              onClick={() => {
                setOptionsOpen(true);
                setAnswerRevealed(true);
                setExplanationOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Reveal Explanation
            </button>
          )}
          {canRevealAnalytics && (
            <button
              onClick={() => {
                if (showAnswer || showExplanation) {
                  setOptionsOpen(true);
                }
                if (hasAnswered) {
                  setAnswerRevealed(true);
                }
                setAnalyticsOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted/80"
            >
              Show Analytics
            </button>
          )}
        </div>
      ) : null}

      {/* Explanation */}
      {showExplanation && (
        <div className="mb-3">
          {!filters.showExplanation && (
            <button
              onClick={() => setExplanationOpen(!explanationOpen)}
              className="flex items-center gap-1 text-xs font-medium text-primary mb-1"
            >
              Explanation {explanationOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
          {showExplanation && (
            <div className="bg-muted/60 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">EXPLANATION: </span>{question.explanation}
            </div>
          )}
        </div>
      )}

      {/* Analytics */}
      {showAnalytics && (
        <div className="mb-3 rounded-xl border border-border bg-muted/30 p-3">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Option Attempts</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Pie chart based on attempted percentage per option</p>
            </div>
            <div className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
              {question.analytics.totalAttempts.toLocaleString()} attempts
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[160px_1fr] md:items-center">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={optionAttemptData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {optionAttemptData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name, item) => [`${value}%`, item.payload.fullLabel]}
                    contentStyle={{
                      borderRadius: '12px',
                      borderColor: 'hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {optionAttemptData.map((entry) => (
                  <div key={entry.name} className="rounded-lg bg-background px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="font-semibold text-foreground">{entry.fullLabel}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{entry.value}% attempted</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <StatBadge label="Right" value={`${question.analytics.correctPercent}%`} tone="success" />
                <StatBadge label="Wrong" value={`${question.analytics.wrongPercent}%`} tone="destructive" />
                <StatBadge label="Attempts" value={question.analytics.totalAttempts.toLocaleString()} tone="neutral" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <button onClick={onDoubt} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted">
            <MessageCircleQuestion className="w-3.5 h-3.5" /> Doubt
          </button>
        </div>
        {!hasAnswered && !answer?.isSkipped && showOptions && !showAllAnswers && !showAnswer && (
          <button
            onClick={onSkip}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted"
          >
            <SkipForward className="w-3.5 h-3.5" /> Skip
          </button>
        )}
        {answer?.isSkipped && (
          <span className="text-xs text-muted-foreground italic">Skipped</span>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;

const OPTION_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

function getOptionAttemptData(question: MCQuestion) {
  if (question.analytics.optionAttempts?.length === question.options.length) {
    return question.options.map((option, index) => ({
      name: option.label,
      fullLabel: `Option ${option.label}`,
      value: question.analytics.optionAttempts?.find(item => item.optionId === option.id)?.percent ?? 0,
      color: OPTION_COLORS[index % OPTION_COLORS.length],
    }));
  }

  const correctIndex = question.options.findIndex(option => option.isCorrect);
  const wrongWeights = [
    [0.5, 0.3, 0.2],
    [0.45, 0.35, 0.2],
    [0.4, 0.35, 0.25],
    [0.55, 0.25, 0.2],
  ][(question.id - 1) % 4];

  const optionPercents = new Array(question.options.length).fill(0);
  optionPercents[correctIndex] = question.analytics.correctPercent;

  const wrongIndexes = question.options.map((_, index) => index).filter(index => index !== correctIndex);
  let assignedWrong = 0;

  wrongIndexes.forEach((index, weightIndex) => {
    const value = Math.round(question.analytics.wrongPercent * wrongWeights[weightIndex]);
    optionPercents[index] = value;
    assignedWrong += value;
  });

  const remainder = question.analytics.wrongPercent - assignedWrong;
  if (wrongIndexes.length > 0) {
    optionPercents[wrongIndexes[0]] += remainder;
  }

  return question.options.map((option, index) => ({
    name: option.label,
    fullLabel: `Option ${option.label}`,
    value: optionPercents[index],
    color: OPTION_COLORS[index % OPTION_COLORS.length],
  }));
}

function StatBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'success' | 'destructive' | 'neutral';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-success/20 bg-success/10 text-success'
      : tone === 'destructive'
        ? 'border-destructive/20 bg-destructive/10 text-destructive'
        : 'border-border bg-background text-foreground';

  return (
    <div className={`rounded-lg border px-3 py-2 ${toneClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
