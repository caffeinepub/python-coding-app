import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Loader2, Copy, Check } from 'lucide-react';
import { type Lesson } from '../backend';
import DifficultyBadge from './DifficultyBadge';
import PythonHighlight from './PythonHighlight';
import { useMarkComplete } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';

interface LessonDetailProps {
  lesson: Lesson;
  isCompleted: boolean;
  onClose: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, isCompleted, onClose }) => {
  const markComplete = useMarkComplete();
  const [copied, setCopied] = useState(false);

  const handleMarkComplete = () => {
    if (isCompleted) return;
    markComplete.mutate(lesson.id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lesson.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-detail-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-card border border-border rounded-xl shadow-2xl animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border flex-shrink-0">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <DifficultyBadge difficulty={lesson.difficulty} size="md" />
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-xs text-primary font-mono bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>
            <h2
              id="lesson-detail-title"
              className="text-xl font-bold text-foreground leading-tight"
            >
              {lesson.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close lesson"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              About this lesson
            </h3>
            <p className="text-foreground/90 leading-relaxed">{lesson.description}</p>
          </div>

          {/* Code snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Code Example
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary"
                aria-label="Copy code"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <PythonHighlight code={lesson.codeSnippet} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-border flex-shrink-0 bg-card">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            ← Back to lessons
          </Button>

          <Button
            onClick={handleMarkComplete}
            disabled={isCompleted || markComplete.isPending}
            className={
              isCompleted
                ? 'bg-primary/20 text-primary border border-primary/30 cursor-default hover:bg-primary/20'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-green'
            }
          >
            {markComplete.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed ✓
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Mark as Complete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
