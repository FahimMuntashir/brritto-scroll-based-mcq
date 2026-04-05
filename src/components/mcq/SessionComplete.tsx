import { SessionStats } from '@/types/mcq';
import { CheckCircle, XCircle, SkipForward, Clock, ArrowLeft } from 'lucide-react';

interface SessionCompleteProps {
  stats: SessionStats;
  onReviewMistakes: () => void;
  onContinue: () => void;
  onBack: () => void;
}

const SessionComplete = ({ stats, onReviewMistakes, onContinue, onBack }: SessionCompleteProps) => {
  const accuracy = stats.totalAttempted > 0
    ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
    : 0;

  const minutes = Math.floor(stats.timeSpent / 60);
  const seconds = stats.timeSpent % 60;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <header className="px-4 py-3 flex items-center gap-3 border-b border-border bg-card">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Session Complete</h1>
      </header>

      <div className="flex-1 p-5 space-y-6">
        {/* Hero */}
        <div className="text-center pt-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Session Complete</h2>
          <p className="text-xs text-muted-foreground">Performance Summary</p>
        </div>

        {/* Accuracy ring */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${accuracy * 2.64} ${264 - accuracy * 2.64}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{accuracy}%</span>
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox icon={<CheckCircle className="w-4 h-4 text-success" />} label="Correct" value={stats.correct} />
          <StatBox icon={<XCircle className="w-4 h-4 text-destructive" />} label="Wrong" value={stats.wrong} />
          <StatBox icon={<SkipForward className="w-4 h-4 text-muted-foreground" />} label="Skipped" value={stats.skipped} />
        </div>

        <div className="flex items-center gap-2 bg-card rounded-xl border border-border p-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground font-medium">Time Spent:</span>
          <span className="text-sm text-muted-foreground">{minutes}m {seconds}s</span>
        </div>

        {/* Subject breakdown */}
        {Object.keys(stats.subjectBreakdown).length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subject-wise Accuracy</h3>
            <div className="space-y-2">
              {Object.entries(stats.subjectBreakdown).map(([subject, data]) => {
                const subAcc = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;
                return (
                  <div key={subject} className="flex items-center justify-between bg-card rounded-lg border border-border p-3">
                    <span className="text-sm font-medium text-foreground">{subject}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${subAcc}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-10 text-right">{subAcc}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-4 space-y-3 border-t border-border bg-card">
        <button
          onClick={onReviewMistakes}
          className="w-full py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
        >
          Review Mistakes
        </button>
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl border border-border p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default SessionComplete;
