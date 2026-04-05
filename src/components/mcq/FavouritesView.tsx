import { MCQuestion } from '@/types/mcq';
import { ArrowLeft, Bookmark } from 'lucide-react';

interface FavouritesViewProps {
  questions: MCQuestion[];
  onBack: () => void;
}

const FavouritesView = ({ questions, onBack }: FavouritesViewProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center gap-3 border-b border-border bg-card">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <Bookmark className="w-5 h-5 text-primary fill-primary" />
        <h1 className="text-lg font-bold text-foreground">Favourites</h1>
        <span className="ml-auto text-xs text-muted-foreground">{questions.length} saved</span>
      </header>

      <div className="flex-1 p-4 space-y-3">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No favourites yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Bookmark questions to revisit later.</p>
          </div>
        ) : (
          questions.map(q => (
            <div key={q.id} className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Q{q.id} · {q.subject}</p>
              <p className="text-sm font-medium text-foreground mb-2">{q.text}</p>
              <div className="space-y-1.5">
                {q.options.map(opt => (
                  <div
                    key={opt.id}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      opt.isCorrect ? 'border-success bg-success/10' : 'border-border'
                    }`}
                  >
                    <span className="font-semibold text-muted-foreground mr-2">{opt.label}.</span>
                    <span className="text-foreground">{opt.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-muted/60 rounded-lg p-2.5 text-xs text-muted-foreground leading-relaxed">
                {q.explanation}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavouritesView;
