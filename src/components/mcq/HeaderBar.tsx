import { Search, SlidersHorizontal, Volume2, VolumeX } from 'lucide-react';

interface HeaderBarProps {
  onSearchOpen: () => void;
  onFilterOpen: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

const HeaderBar = ({ onSearchOpen, onFilterOpen, soundEnabled, onSoundToggle }: HeaderBarProps) => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-foreground tracking-tight">MCQ Learn</h1>
      <div className="flex items-center gap-2">
        <button onClick={onSoundToggle} className="p-2 rounded-lg hover:bg-muted transition-colors">
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-foreground" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        <button onClick={onSearchOpen} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Search className="w-5 h-5 text-foreground" />
        </button>
        <button onClick={onFilterOpen} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
