import { MCQuestion, UserAnswer, FilterState } from '@/types/mcq';
import { Bookmark, BarChart3, SkipForward, Volume2, ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react';
import { useState } from 'react';

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
  const [explanationOpen, setExplanationOpen] = useState(false);
  const hasAnswered = !!answer && !answer.isSkipped;
  const showExplanation = filters.showExplanation || explanationOpen;

  const getOptionStyle = (optionId: string, isCorrect: boolean) => {
    if (!hasAnswered && !showAllAnswers) return 'border-border bg-card hover:bg-muted/50';
    if (showAllAnswers && isCorrect) return 'border-success bg-success/10';
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

      {/* Options */}
      {filters.showOptions && (
        <div className="space-y-2 mb-3">
          {question.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                if (hasAnswered || showAllAnswers) return;
                setExplanationOpen(true);
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

      {/* Explanation */}
      {(showExplanation || (hasAnswered && !filters.showExplanation)) && (
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
      {filters.showAnalytics && (
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
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted">
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
        </div>
        {!hasAnswered && !answer?.isSkipped && filters.showOptions && !showAllAnswers && (
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
