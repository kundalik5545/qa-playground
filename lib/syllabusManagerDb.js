import { getIdbItem, setIdbItem } from "@/lib/indexedDb";
import DEFAULT_SYLLABUS_DATA from "@/data/studyTrackerSyllabi";

const IDB_SYLLABI_KEY = "sm-syllabi";
const IDB_ORDER_KEY = "sm-order";

// ── Load / Save ────────────────────────────────────────────────────────────

export async function loadSyllabiFromIdb() {
  const syllabi = await getIdbItem(IDB_SYLLABI_KEY);
  const order = await getIdbItem(IDB_ORDER_KEY);
  return { syllabi, order };
}

export async function saveSyllabiToIdb(syllabi, order) {
  await setIdbItem(IDB_SYLLABI_KEY, syllabi);
  await setIdbItem(IDB_ORDER_KEY, order);
}

// ── Seed defaults ──────────────────────────────────────────────────────────

export function getDefaultSyllabi() {
  return JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA));
}

export function getDefaultOrder() {
  return Object.keys(DEFAULT_SYLLABUS_DATA);
}

// ── ID helpers ─────────────────────────────────────────────────────────────

export function makeSyllabusId() {
  return `syl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makeSectionId(syllabusId, index) {
  return `${syllabusId}-s${index}-${Date.now()}`;
}

export function makeTopicId(syllabusId, sectionIndex, topicIndex) {
  return `${syllabusId}-s${sectionIndex}-t${topicIndex}-${Date.now()}`;
}

// Re-assigns all IDs when importing to avoid collisions
export function reIdSyllabus(syl) {
  const base = makeSyllabusId();
  return {
    ...syl,
    id: base,
    sections: (syl.sections || []).map((sec, si) => ({
      ...sec,
      id: makeSectionId(base, si),
      topics: (sec.topics || []).map((topic, ti) => ({
        ...topic,
        id: makeTopicId(base, si, ti),
        subtopics: Array.isArray(topic.subtopics) ? topic.subtopics : [],
        resources: Array.isArray(topic.resources) ? topic.resources : [],
      })),
    })),
  };
}

// ── Stats ──────────────────────────────────────────────────────────────────

export function countTopics(syl) {
  return (syl.sections || []).reduce(
    (sum, sec) => sum + (sec.topics || []).length,
    0,
  );
}

export function calcProgress(syl, progressMap) {
  const total = countTopics(syl);
  if (total === 0) return 0;
  const done = (syl.sections || []).reduce(
    (sum, sec) =>
      sum + (sec.topics || []).filter((t) => progressMap?.[t.id]?.done).length,
    0,
  );
  return Math.round((done / total) * 100);
}

// ── File helpers ───────────────────────────────────────────────────────────

export function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function pickJsonFile(onSuccess, onError) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        onSuccess(JSON.parse(ev.target.result));
      } catch (err) {
        onError?.("Invalid JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export function makeExportFilename(label) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const date = new Date().toISOString().slice(0, 10);
  return `qa-syllabus-${slug}-${date}.json`;
}
