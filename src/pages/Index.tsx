import { useState, useRef, useCallback, useMemo } from 'react';
import { useMCQStore } from '@/hooks/useMCQStore';
import HeaderBar from '@/components/mcq/HeaderBar';
import FilterDrawer from '@/components/mcq/FilterDrawer';
import SearchModal from '@/components/mcq/SearchModal';
import QuestionCard from '@/components/mcq/QuestionCard';
import PaginationBar from '@/components/mcq/PaginationBar';
import DoubtModal from '@/components/mcq/DoubtModal';
import SessionComplete from '@/components/mcq/SessionComplete';
import MistakeLog from '@/components/mcq/MistakeLog';
import FavouritesView from '@/components/mcq/FavouritesView';
import BottomNav from '@/components/mcq/BottomNav';

type View = 'feed' | 'favourites' | 'mistakes' | 'stats';

const Index = () => {
  const store = useMCQStore();
  const [view, setView] = useState<View>('feed');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [jumpTo, setJumpTo] = useState('');
  const [doubtQuestion, setDoubtQuestion] = useState<{ id: number; text: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleJumpApply = useCallback(() => {
    const num = parseInt(jumpTo);
    if (!isNaN(num) && num >= 1 && num <= store.questions.length) {
      const page = Math.ceil(num / 10);
      store.setCurrentPage(page);
      setTimeout(() => {
        const el = document.getElementById(`question-${num}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [jumpTo, store]);

  const handleApplyFilters = useCallback(() => {
    handleJumpApply();
    setFilterOpen(false);
  }, [handleJumpApply]);

  const handleReset = useCallback(() => {
    store.updateFilter('showOptions', false);
    store.updateFilter('showAnswer', false);
    store.updateFilter('showExplanation', false);
    store.updateFilter('showAnalytics', false);
    store.updateFilter('showAllAnswers', false);
    setJumpTo('');
  }, [store]);

  const handleSpeak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      speechSynthesis.speak(u);
    }
  }, []);

  const searchSuggestions = useMemo(() => {
    if (!store.searchQuery) return [];
    const subjects = [...new Set(store.questions.map(q => q.subject))];
    return subjects.filter(s => s.toLowerCase().includes(store.searchQuery.toLowerCase())).slice(0, 5);
  }, [store.searchQuery, store.questions]);

  const mistakes = store.getMistakes();
  const favouriteQs = store.getFavouriteQuestions();

  // Session complete view
  if (view === 'stats') {
    return (
      <SessionComplete
        stats={store.getSessionStats()}
        onReviewMistakes={() => setView('mistakes')}
        onContinue={() => setView('feed')}
        onBack={() => setView('feed')}
      />
    );
  }

  // Mistake log view
  if (view === 'mistakes') {
    return (
      <div>
        <MistakeLog mistakes={mistakes} answers={store.answers} onBack={() => setView('feed')} />
        <BottomNav active={view} onChange={setView} mistakeCount={mistakes.length} favouriteCount={favouriteQs.length} />
      </div>
    );
  }

  // Favourites view
  if (view === 'favourites') {
    return (
      <div>
        <FavouritesView questions={favouriteQs} onBack={() => setView('feed')} />
        <BottomNav active={view} onChange={setView} mistakeCount={mistakes.length} favouriteCount={favouriteQs.length} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <HeaderBar
        onSearchOpen={() => setSearchOpen(true)}
        onFilterOpen={() => setFilterOpen(true)}
        soundEnabled={store.soundEnabled}
        onSoundToggle={() => store.setSoundEnabled(!store.soundEnabled)}
      />

      {/* Active filters indicator */}
      {(store.filters.showAllAnswers || store.filters.showAnswer || store.filters.showExplanation || store.filters.showAnalytics) && (
        <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center gap-2 flex-wrap">
          {store.filters.showAllAnswers && <FilterChip label="All Answers" />}
          {store.filters.showAnswer && <FilterChip label="Answer" />}
          {store.filters.showExplanation && <FilterChip label="Explanations" />}
          {store.filters.showAnalytics && <FilterChip label="Analytics" />}
        </div>
      )}

      {/* Search indicator */}
      {store.searchQuery && (
        <div className="px-4 py-2 bg-muted border-b border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing results for "<span className="font-medium text-foreground">{store.searchQuery}</span>"
          </span>
          <button onClick={() => store.setSearchQuery('')} className="text-xs text-primary font-medium">Clear</button>
        </div>
      )}

      {/* Question feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {store.paginatedQuestions.map(q => (
          <div key={q.id} id={`question-${q.id}`}>
            <QuestionCard
              question={q}
              answer={store.answers[q.id]}
              filters={store.filters}
              isFavourite={store.favourites.has(q.id)}
              onSelectOption={(optId) => store.selectAnswer(q.id, optId)}
              onSkip={() => store.skipQuestion(q.id)}
              onToggleFavourite={() => store.toggleFavourite(q.id)}
              onSpeak={() => handleSpeak(q.text + '. ' + q.options.map(o => o.label + '. ' + o.text).join('. '))}
              onDoubt={() => setDoubtQuestion({ id: q.id, text: q.text })}
              showAllAnswers={store.filters.showAllAnswers}
            />
          </div>
        ))}

        <PaginationBar
          currentPage={store.currentPage}
          totalPages={store.totalPages}
          onPageChange={(p) => {
            store.setCurrentPage(p);
            setTimeout(() => {
              scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50);
          }}
        />
      </div>

      <BottomNav active={view} onChange={setView} mistakeCount={mistakes.length} favouriteCount={favouriteQs.length} />

      {/* Modals */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={store.filters}
        onApplyFilters={(nextFilters) => {
          store.updateFilter('showOptions', nextFilters.showOptions);
          store.updateFilter('showAnswer', nextFilters.showAnswer);
          store.updateFilter('showExplanation', nextFilters.showExplanation);
          store.updateFilter('showAnalytics', nextFilters.showAnalytics);
          store.updateFilter('showAllAnswers', nextFilters.showAllAnswers);
        }}
        jumpToQuestion={jumpTo}
        onJumpChange={setJumpTo}
        onApply={handleApplyFilters}
        onReset={handleReset}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={store.searchQuery}
        onSearchChange={store.setSearchQuery}
        suggestions={searchSuggestions}
      />

      <DoubtModal
        open={!!doubtQuestion}
        onClose={() => setDoubtQuestion(null)}
        questionId={doubtQuestion?.id ?? null}
        questionText={doubtQuestion?.text ?? ''}
      />
    </div>
  );
};

function FilterChip({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
      {label}
    </span>
  );
}

export default Index;
