import { FilterState } from '@/types/mcq';
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (nextFilters: FilterState) => void;
  jumpToQuestion: string;
  onJumpChange: (v: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterDrawer = ({
  open, onClose, filters, onApplyFilters,
  jumpToQuestion, onJumpChange, onApply, onReset,
}: FilterDrawerProps) => {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    if (open) {
      setDraftFilters(filters);
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
            label="Explanation"
            checked={draftFilters.showExplanation}
            onChange={v => setDraftFilters(prev => ({ ...prev, showExplanation: v }))}
          />
          <FilterRow
            label="Show Analytics"
            checked={draftFilters.showAnalytics}
            onChange={v => setDraftFilters(prev => ({ ...prev, showAnalytics: v }))}
          />

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-2">JUMP TO QUESTION</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="e.g. Question 12"
                value={jumpToQuestion}
                onChange={e => onJumpChange(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
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
