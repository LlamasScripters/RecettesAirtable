import { Grid, List, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';

export type ViewMode = 'grid' | 'list' | 'compact';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewModeToggle({ viewMode, onViewModeChange, className }: ViewModeToggleProps) {
  const modes = [
    { key: 'grid' as const, icon: LayoutGrid, label: 'Grille' },
    { key: 'list' as const, icon: List, label: 'Liste' },
    { key: 'compact' as const, icon: Grid, label: 'Compact' }
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {modes.map(({ key, icon: Icon, label }) => (
        <Button
          key={key}
          variant={viewMode === key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange(key)}
          className={`p-2 ${viewMode === key ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
}