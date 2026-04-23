import { FilterState } from '@/types/mcq';
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (nextFilters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterDrawer = ({
  open, onClose, filters, onApplyFilters,
  onApply, onReset,
}: FilterDrawerProps) => {
  const [draftFilters, setDraftFilters] = useState(filters);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (open) {
      setDraftFilters(filters);
      setValidationMessage('');
    }
  }, [open, filters]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-card shadow-xl p-5 flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-5 flex-1">
          <FilterRow
            label="Show All Answers"
            checked={draftFilters.showAllAnswers}
            onChange={v => setDraftFilters(prev => ({ ...prev, showAllAnswers: v }))}
          />
          <FilterRow
            label="Show Options"
            checked={draftFilters.showOptions}
            onChange={v => setDraftFilters(prev => ({ ...prev, showOptions: v }))}
          />
          <FilterRow
            label="Show Answer"
            checked={draftFilters.showAnswer}
            onChange={v => setDraftFilters(prev => ({ ...prev, showAnswer: v }))}
          />
          <FilterRow
            label="Explanation"
            checked={draftFilters.showExplanation}
            onChange={v => setDraftFilters(prev => ({ ...prev, showExplanation: v }))}
          />
          <FilterRow
            label="Show Analytics"
            checked={draftFilters.showAnalytics}
            onChange={v => setDraftFilters(prev => ({ ...prev, showAnalytics: v }))}
          />

          <p className="text-xs leading-5 text-muted-foreground">
            Explanation automatically reveals answer. Analytics cannot be enabled alone, and some analytics states
            auto-reveal options based on the matrix.
          </p>

          {validationMessage ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {validationMessage}
            </div>
          ) : null}

        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => {
              if (
                draftFilters.showAnalytics &&
                !draftFilters.showOptions &&
                !draftFilters.showAnswer &&
                !draftFilters.showExplanation &&
                !draftFilters.showAllAnswers
              ) {
                setValidationMessage('Analytics cannot be enabled alone. Turn on Options, Answer, or Explanation first.');
                return;
              }
              onApplyFilters(draftFilters);
              onApply();
            }}
            className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

function FilterRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default FilterDrawer;
