import { X, ImagePlus } from 'lucide-react';
import { useState } from 'react';

interface DoubtModalProps {
  open: boolean;
  onClose: () => void;
  questionId: number | null;
  questionText: string;
}

const DoubtModal = ({ open, onClose, questionId, questionText }: DoubtModalProps) => {
  const [doubt, setDoubt] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDoubt('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-xl p-5 max-w-md mx-auto animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground">Submit a Doubt</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {questionId && (
          <div className="bg-muted rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">REFERENCE: Q{questionId}</p>
            <p className="text-sm text-foreground line-clamp-2">{questionText}</p>
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-2">YOUR QUESTION</p>
          <textarea
            value={doubt}
            onChange={e => setDoubt(e.target.value)}
            placeholder="Type your specific doubt here...&#10;What part is confusing you?"
            className="w-full h-24 px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <button className="flex items-center gap-2 text-sm text-muted-foreground mb-4 px-3 py-2 rounded-lg border border-dashed border-border hover:bg-muted transition-colors">
          <ImagePlus className="w-4 h-4" />
          Attach supporting image (optional)
        </button>

        {submitted ? (
          <div className="text-center py-3 bg-success/10 rounded-lg text-sm font-medium text-success">
            ✓ Doubt submitted successfully!
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!doubt.trim()}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              Submit Doubt →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtModal;
