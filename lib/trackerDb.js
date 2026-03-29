// ─── Shape utilities for Study Tracker DB migration ───────────────────────────
// reshapeToState: used server-side in GET /api/tracker/state
// mergeStates:    used client-side in StudyTrackerProvider on mount

/**
 * Convert flat DB rows → state object matching the localStorage shape.
 * habitLogs must be fetched with { include: { habit: { select: { habitId: true } } } }
 */
export function reshapeToState({
  progress,
  subtopics,
  dailyTasks,
  habits,
  habitLogs,
  syllabi,
  logs,
}) {
  return {
    progress: Object.fromEntries(
      progress.map((p) => [
        p.topicId,
        {
          done: p.done,
          ...(p.notes ? { notes: p.notes } : {}),
          ...(p.doneAt
            ? { doneAt: p.doneAt.toISOString().slice(0, 10) }
            : {}),
        },
      ])
    ),

    subtopics: subtopics.reduce((acc, s) => {
      acc[s.topicId] = acc[s.topicId] || {};
      acc[s.topicId][s.subtopicTitle] = s.checked;
      return acc;
    }, {}),

    daily: dailyTasks.reduce((acc, t) => {
      acc[t.date] = acc[t.date] || [];
      acc[t.date].push({
        id: t.taskId,
        title: t.title,
        done: t.done,
        timeMin: t.timeMin,
        ...(t.reason ? { reason: t.reason } : {}),
      });
      return acc;
    }, {}),

    habits: habits.map((h) => ({
      id: h.habitId,
      title: h.title,
      timeMin: h.timeMin,
      recurrence: h.recurrence,
      customDays: h.customDays,
      startDate: h.startDate,
      ...(h.endDate   ? { endDate:   h.endDate   } : {}),
      ...(h.timeSlot  ? { timeSlot:  h.timeSlot  } : {}),
      active: h.active,
    })),

    habitLog: habitLogs.reduce((acc, l) => {
      acc[l.date] = acc[l.date] || {};
      acc[l.date][l.habit.habitId] = l.done;
      return acc;
    }, {}),

    // null means "use DEFAULT_SYLLABUS_DATA" — caller handles this
    syllabi: syllabi.length
      ? Object.fromEntries(syllabi.map((s) => [s.syllabusId, s.data]))
      : null,

    log: logs.map((l) => ({
      date: l.date,
      ...(l.topicId ? { topicId: l.topicId } : {}),
      ...(l.syllabusId ? { syllabusId: l.syllabusId } : {}),
      action: l.action,
    })),

    custom: {}, // retained in localStorage only
  };
}

/**
 * Merge local (localStorage) and DB states.
 * DB wins for most keys that have content in DB.
 * Habits are merged by ID so local-only habits (not yet synced / DB missing
 * fields like timeSlot) are never silently dropped.
 */
export function mergeStates(local, db) {
  if (!db) return local;
  return {
    syllabi: db.syllabi || local.syllabi,
    progress:
      Object.keys(db.progress).length ? db.progress : local.progress,
    custom: local.custom, // always local-only
    log: db.log.length ? db.log : local.log,
    subtopics:
      Object.keys(db.subtopics).length ? db.subtopics : local.subtopics,
    daily:
      Object.keys(db.daily).length ? db.daily : local.daily,
    habits: mergeHabits(local.habits, db.habits),
    habitLog:
      Object.keys(db.habitLog).length ? db.habitLog : local.habitLog,
  };
}

/**
 * Merge two habits arrays by habit ID.
 * - Habits that exist in both: local wins (preserves fields like timeSlot
 *   that are not stored in the DB schema).
 * - Habits only in DB: kept as-is.
 * - Habits only in local: kept (handles new habits not yet synced to DB).
 */
function mergeHabits(local = [], db = []) {
  const localMap = new Map(local.map((h) => [h.id, h]));
  const dbMap    = new Map(db.map((h) => [h.id, h]));

  const merged = [];

  // DB habits — overlay with local data to restore any fields the DB doesn't store
  for (const [id, dbHabit] of dbMap) {
    const localHabit = localMap.get(id);
    merged.push(localHabit ? { ...dbHabit, ...localHabit } : dbHabit);
  }

  // Local-only habits (new, not yet persisted in DB)
  for (const [id, localHabit] of localMap) {
    if (!dbMap.has(id)) merged.push(localHabit);
  }

  return merged;
}