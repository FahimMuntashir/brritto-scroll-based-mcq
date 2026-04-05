import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  suggestions: string[];
}

const SearchModal = ({ open, onClose, searchQuery, onSearchChange, suggestions }: SearchModalProps) => {
  const [recentSearches] = useState(['Physics', 'Newton', 'photosynthesis']);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 left-0 right-0 bg-card shadow-xl animate-in slide-in-from-top p-4 max-w-md mx-auto rounded-b-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Search questions, topics..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-sm font-medium text-primary">Cancel</button>
        </div>

        {searchQuery && suggestions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Suggestions</p>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { onSearchChange(s); onClose(); }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                {s}
              </button>
            ))}
          </div>
        )}

        {!searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Recent Searches</p>
              <button className="text-xs text-primary font-medium">Clear All</button>
            </div>
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => { onSearchChange(s); onClose(); }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
