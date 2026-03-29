import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/tracker/sync
 * Body: { fullState: { syllabi?, progress?, subtopics?, daily?, habits?, habitLog?, log? } }
 *
 * Bulk upserts any supplied keys. Used for:
 *  - First-login migration (all keys)
 *  - handleImport (all keys)
 *  - syncPatch (partial key updates from dual-write)
 */
export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { fullState } = body;
  if (!fullState)
    return NextResponse.json({ error: "fullState required" }, { status: 400 });

  const { syllabi, progress, subtopics, daily, habits, habitLog, log } =
    fullState;

  await prisma.$transaction(async (tx) => {
    // ── Syllabi ──────────────────────────────────────────────────────────────
    if (syllabi && typeof syllabi === "object") {
      for (const [syllabusId, data] of Object.entries(syllabi)) {
        await tx.userSyllabus.upsert({
          where: { userId_syllabusId: { userId, syllabusId } },
          create: { userId, syllabusId, data },
          update: { data },
        });
      }
    }

    // ── Topic progress ────────────────────────────────────────────────────────
    if (progress && typeof progress === "object") {
      for (const [topicId, p] of Object.entries(progress)) {
        await tx.topicProgress.upsert({
          where: { userId_topicId: { userId, topicId } },
          create: {
            userId,
            topicId,
            done: p.done ?? false,
            notes: p.notes ?? null,
            doneAt: p.doneAt ? new Date(p.doneAt) : null,
          },
          update: {
            done: p.done ?? false,
            notes: p.notes ?? null,
            doneAt: p.doneAt ? new Date(p.doneAt) : null,
          },
        });
      }
    }

    // ── Subtopic progress ─────────────────────────────────────────────────────
    if (subtopics && typeof subtopics === "object") {
      for (const [topicId, subtopicMap] of Object.entries(subtopics)) {
        if (typeof subtopicMap !== "object") continue;
        for (const [subtopicTitle, checked] of Object.entries(subtopicMap)) {
          await tx.subtopicProgress.upsert({
            where: {
              userId_topicId_subtopicTitle: { userId, topicId, subtopicTitle },
            },
            create: { userId, topicId, subtopicTitle, checked: !!checked },
            update: { checked: !!checked },
          });
        }
      }
    }

    // ── Daily tasks ───────────────────────────────────────────────────────────
    if (daily && typeof daily === "object") {
      for (const [date, tasks] of Object.entries(daily)) {
        if (!Array.isArray(tasks)) continue;
        for (const task of tasks) {
          if (!task.id) continue;
          const taskId = String(task.id);
          await tx.dailyTask.upsert({
            where: { userId_taskId: { userId, taskId } },
            create: {
              userId,
              date,
              taskId,
              title: task.title,
              done: task.done ?? false,
              timeMin: task.timeMin ?? 0,
              reason: task.reason ?? null,
            },
            update: {
              date,
              title: task.title,
              done: task.done ?? false,
              timeMin: task.timeMin ?? 0,
              reason: task.reason ?? null,
            },
          });
        }
      }
    }

    // ── Habits ────────────────────────────────────────────────────────────────
    // Upsert habits first so we can resolve client habitId → DB Habit.id for logs
    const freshHabitIdMap = {}; // clientHabitId → Habit.id (DB primary key)
    if (habits && Array.isArray(habits)) {
      for (const h of habits) {
        if (!h.id) continue;
        const row = await tx.habit.upsert({
          where: { userId_habitId: { userId, habitId: h.id } },
          create: {
            userId,
            habitId: h.id,
            title: h.title,
            timeMin: h.timeMin ?? 0,
            recurrence: h.recurrence,
            customDays: h.customDays ?? [],
            startDate: h.startDate,
            endDate: h.endDate ?? null,
            active: h.active ?? true,
          },
          update: {
            title: h.title,
            timeMin: h.timeMin ?? 0,
            recurrence: h.recurrence,
            customDays: h.customDays ?? [],
            startDate: h.startDate,
            endDate: h.endDate ?? null,
            active: h.active ?? true,
          },
          select: { id: true, habitId: true },
        });
        freshHabitIdMap[h.id] = row.id;
      }
    }

    // ── Habit log ─────────────────────────────────────────────────────────────
    if (habitLog && typeof habitLog === "object") {
      // Resolve client habitId → DB Habit.id (merge fresh upserts + existing DB rows)
      const existingHabits = await tx.habit.findMany({
        where: { userId },
        select: { id: true, habitId: true },
      });
      const habitIdMap = {
        ...Object.fromEntries(existingHabits.map((h) => [h.habitId, h.id])),
        ...freshHabitIdMap,
      };

      for (const [date, logMap] of Object.entries(habitLog)) {
        if (typeof logMap !== "object") continue;
        for (const [clientHabitId, done] of Object.entries(logMap)) {
          const dbHabitId = habitIdMap[clientHabitId];
          if (!dbHabitId) continue;
          await tx.habitLog.upsert({
            where: { userId_habitId_date: { userId, habitId: dbHabitId, date } },
            create: { userId, habitId: dbHabitId, date, done: !!done },
            update: { done: !!done },
          });
        }
      }
    }

    // ── Activity log ──────────────────────────────────────────────────────────
    if (log && Array.isArray(log) && log.length > 0) {
      await tx.activityLog.createMany({
        data: log.map((entry) => ({
          userId,
          date: entry.date,
          topicId: entry.topicId ?? null,
          syllabusId: entry.syllabusId ?? null,
          action: entry.action,
        })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}
