import React from 'react';
import { Difficulty } from '../backend';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; classes: string }> = {
  [Difficulty.Beginner]: {
    label: 'Beginner',
    classes: 'bg-beginner-muted text-beginner-text border border-beginner/30',
  },
  [Difficulty.Intermediate]: {
    label: 'Intermediate',
    classes: 'bg-intermediate-muted text-intermediate-text border border-intermediate/30',
  },
  [Difficulty.Advanced]: {
    label: 'Advanced',
    classes: 'bg-advanced-muted text-advanced-text border border-advanced/30',
  },
};

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'sm' }) => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium font-mono ${sizeClasses} ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default DifficultyBadge;
