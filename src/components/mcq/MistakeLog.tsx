import { MCQuestion, UserAnswer } from '@/types/mcq';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface MistakeLogProps {
  mistakes: MCQuestion[];
  answers: Record<number, UserAnswer>;
  onBack: () => void;
}

const MistakeLog = ({ mistakes, answers, onBack }: MistakeLogProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center gap-3 border-b border-border bg-card">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Mistake Log</h1>
        <span className="ml-auto text-xs text-muted-foreground">{mistakes.length} questions</span>
      </header>

      <div className="flex-1 p-4 space-y-3">
        {mistakes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No mistakes yet. Keep learning!</p>
          </div>
        ) : (
          mistakes.map(q => {
            const answer = answers[q.id];
            const selectedOption = q.options.find(o => o.id === answer?.selectedOptionId);
            const correctOption = q.options.find(o => o.isCorrect);
            return (
              <div key={q.id} className="bg-card rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-1">Q{q.id} · {q.subject}</p>
                <p className="text-sm font-medium text-foreground mb-3">{q.text}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-destructive font-medium">Your answer:</span>
                    <span className="text-foreground">{selectedOption?.text}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-success font-medium">Correct:</span>
                    <span className="text-foreground">{correctOption?.text}</span>
                  </div>
                </div>
                <div className="mt-3 bg-muted/60 rounded-lg p-2.5 text-xs text-muted-foreground leading-relaxed">
                  {q.explanation}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MistakeLog;
