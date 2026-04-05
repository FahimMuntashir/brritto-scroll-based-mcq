import { BookOpen, Bookmark, AlertTriangle, BarChart3 } from 'lucide-react';

type View = 'feed' | 'favourites' | 'mistakes' | 'stats';

interface BottomNavProps {
  active: View;
  onChange: (v: View) => void;
  mistakeCount: number;
  favouriteCount: number;
}

const BottomNav = ({ active, onChange, mistakeCount, favouriteCount }: BottomNavProps) => {
  const items: { id: View; icon: React.ReactNode; label: string; badge?: number }[] = [
    { id: 'feed', icon: <BookOpen className="w-5 h-5" />, label: 'Learn' },
    { id: 'favourites', icon: <Bookmark className="w-5 h-5" />, label: 'Favourites', badge: favouriteCount },
    { id: 'mistakes', icon: <AlertTriangle className="w-5 h-5" />, label: 'Mistakes', badge: mistakeCount },
    { id: 'stats', icon: <BarChart3 className="w-5 h-5" />, label: 'Stats' },
  ];

  return (
    <nav className="sticky bottom-0 z-50 bg-card border-t border-border px-2 py-1.5 flex items-center justify-around">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors relative ${
            active === item.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
          {item.badge && item.badge > 0 ? (
            <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
