import React, { useState, useMemo } from 'react';
import { Loader2, BookOpen, Trophy, Filter } from 'lucide-react';
import { Difficulty, type Lesson } from './backend';
import { useListAllLessons, useGetProgress } from './hooks/useQueries';
import LessonCard from './components/LessonCard';
import LessonDetail from './components/LessonDetail';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

type DifficultyFilter = 'All' | Difficulty;

const FILTER_OPTIONS: { label: string; value: DifficultyFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Beginner', value: Difficulty.Beginner },
  { label: 'Intermediate', value: Difficulty.Intermediate },
  { label: 'Advanced', value: Difficulty.Advanced },
];

const FILTER_ACTIVE_CLASSES: Record<DifficultyFilter, string> = {
  All: 'bg-secondary text-foreground border-border',
  [Difficulty.Beginner]: 'bg-beginner-muted text-beginner-text border-beginner/40',
  [Difficulty.Intermediate]: 'bg-intermediate-muted text-intermediate-text border-intermediate/40',
  [Difficulty.Advanced]: 'bg-advanced-muted text-advanced-text border-advanced/40',
};

function LessonCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between mt-1">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default function App() {
  const { data: lessons, isLoading: lessonsLoading, isError: lessonsError } = useListAllLessons();
  const { data: progress } = useGetProgress();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');

  const completedSet = useMemo(() => {
    if (!progress) return new Set<string>();
    return new Set(progress.map((id) => id.toString()));
  }, [progress]);

  const filteredLessons = useMemo(() => {
    if (!lessons) return [];
    if (difficultyFilter === 'All') return lessons;
    return lessons.filter((l) => l.difficulty === difficultyFilter);
  }, [lessons, difficultyFilter]);

  const totalCount = lessons?.length ?? 0;
  const completedCount = useMemo(() => {
    if (!lessons || !progress) return 0;
    return lessons.filter((l) => completedSet.has(l.id.toString())).length;
  }, [lessons, completedSet, progress]);

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const appId = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'unknown-app';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/pylearn-logo.dim_128x128.png"
              alt="PyLearn Studio logo"
              className="w-9 h-9 rounded-lg object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-foreground text-lg tracking-tight">PyLearn</span>
              <span className="text-xs text-primary font-mono tracking-wider">Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">
              {completedCount} / {totalCount} lessons
            </span>
            <span className="sm:hidden">{completedCount}/{totalCount}</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Hero / Progress section */}
        <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                Python Programming
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Master Python through curated lessons with real code examples.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-3 flex-shrink-0">
              <Trophy className="w-5 h-5 text-intermediate" />
              <div className="text-right">
                <div className="text-lg font-bold text-foreground font-mono">{completedCount}/{totalCount}</div>
                <div className="text-xs text-muted-foreground">completed</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-mono text-primary font-semibold">{progressPercent}%</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2 bg-secondary"
            />
          </div>
        </section>

        {/* Filter bar */}
        <section aria-label="Filter lessons by difficulty">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground mr-1">Filter:</span>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDifficultyFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 font-mono ${
                  difficultyFilter === opt.value
                    ? FILTER_ACTIVE_CLASSES[opt.value]
                    : 'bg-transparent text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
                }`}
                aria-pressed={difficultyFilter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Lessons grid */}
        <section aria-label="Lessons">
          {lessonsError && (
            <div className="text-center py-16 text-destructive">
              <p className="text-lg font-semibold">Failed to load lessons</p>
              <p className="text-sm text-muted-foreground mt-1">Please refresh the page and try again.</p>
            </div>
          )}

          {lessonsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <LessonCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!lessonsLoading && !lessonsError && filteredLessons.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No lessons found for this filter.</p>
            </div>
          )}

          {!lessonsLoading && !lessonsError && filteredLessons.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id.toString()}
                  lesson={lesson}
                  isCompleted={completedSet.has(lesson.id.toString())}
                  onClick={() => setSelectedLesson(lesson)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary">🐍</span>
            <span>PyLearn Studio — Python Programming Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <span className="text-advanced" aria-label="love">♥</span>
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </div>
          <span>© {new Date().getFullYear()} PyLearn Studio</span>
        </div>
      </footer>

      {/* Lesson Detail Modal */}
      {selectedLesson && (
        <LessonDetail
          lesson={selectedLesson}
          isCompleted={completedSet.has(selectedLesson.id.toString())}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}
