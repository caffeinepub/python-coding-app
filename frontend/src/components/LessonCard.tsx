import React from 'react';
import { CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { type Lesson } from '../backend';
import DifficultyBadge from './DifficultyBadge';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  onClick: () => void;
}

const TOPIC_ICONS: Record<string, string> = {
  'Variables': '📦',
  'Loops': '🔄',
  'Functions': '⚡',
  'List': '📋',
  'Dict': '🗂️',
  'Classes': '🏗️',
  'Error': '🛡️',
  'File': '📁',
};

function getTopicIcon(title: string): string {
  for (const [key, icon] of Object.entries(TOPIC_ICONS)) {
    if (title.includes(key)) return icon;
  }
  return '🐍';
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isCompleted, onClick }) => {
  const topicIcon = getTopicIcon(lesson.title);

  return (
    <button
      onClick={onClick}
      className="lesson-card w-full text-left bg-card border border-border rounded-lg p-5 flex flex-col gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Open lesson: ${lesson.title}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">{topicIcon}</span>
          <h3 className="font-semibold text-foreground text-base leading-snug truncate">
            {lesson.title}
          </h3>
        </div>
        {isCompleted && (
          <CheckCircle2
            className="flex-shrink-0 text-primary w-5 h-5 mt-0.5"
            aria-label="Completed"
          />
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
        {lesson.description}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <DifficultyBadge difficulty={lesson.difficulty} />
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>View lesson</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  );
};

export default LessonCard;
