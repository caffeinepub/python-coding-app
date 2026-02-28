# Specification

## Summary
**Goal:** Build a Python programming learning app (PyLearn Studio) with a lesson browser, lesson detail view, progress tracking, and a dark code-editor-inspired theme.

**Planned changes:**
- Backend actor storing at least 8 pre-populated Python lessons (id, title, description, codeSnippet, difficulty, topic) with `getLessons()`, `getLesson(id)`, and `addLesson()` functions
- Backend progress tracking with `markComplete(lessonId)` and `getProgress()` functions, persisted across reloads
- Lesson browser page displaying all lessons as cards with title, topic tag, difficulty badge, and completion indicator
- Filter bar to filter lessons by difficulty (All, Beginner, Intermediate, Advanced)
- Progress summary showing e.g. "3 of 8 completed"
- Lesson detail view with full description and syntax-highlighted Python code block (monospace, line numbers, colored keywords)
- "Mark as Complete" button that updates backend and toggles to "Completed ✓" immediately
- Dark code-editor theme: charcoal backgrounds, green/amber accents, monospace code fonts, glowing interactive elements
- App logo (pylearn-logo.png) displayed in the top navigation header

**User-visible outcome:** Users can browse Python lessons by difficulty, read full lesson details with highlighted code snippets, mark lessons as complete, and track their overall progress — all within a polished dark-themed UI.
