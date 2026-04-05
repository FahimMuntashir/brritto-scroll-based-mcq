import { MCQuestion, UserAnswer, FilterState } from '@/types/mcq';
import { Bookmark, SkipForward, Volume2, ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react';
import { useEffect, useState } from 'react';

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
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 bg-muted/40 rounded-lg px-3 py-2">
          <span className="text-success font-medium">{question.analytics.correctPercent}% Correct</span>
          <span className="text-destructive font-medium">{question.analytics.wrongPercent}% Wrong</span>
          <span>{question.analytics.totalAttempts.toLocaleString()} attempts</span>
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
