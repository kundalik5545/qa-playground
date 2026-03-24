const KEYS = {
  state: "qaPlayground_alertState",
  configCache: "qaPlayground_alertConfigCache",
  visitorId: "qaPlayground_visitorId",
};

// How long the cached config is considered fresh (ms)
const CONFIG_CACHE_TTL = 60 * 60 * 1000; // 60 minutes

// ── Visitor identity ──────────────────────────────────────────────────────────

export function getVisitorId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(KEYS.visitorId);
    if (!id) {
      id =
        "visitor_" +
        Math.random().toString(36).slice(2) +
        Date.now().toString(36);
      localStorage.setItem(KEYS.visitorId, id);
    }
    return id;
  } catch {
    return null;
  }
}

// ── Config cache (populated from /api/public/site-alerts/config) ──────────────

export function getCachedAlertConfig() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.configCache);
    if (!raw) return null;
    const { config, cachedAt } = JSON.parse(raw);
    if (Date.now() - cachedAt > CONFIG_CACHE_TTL) return null;
    return config;
  } catch {
    return null;
  }
}

export function setCachedAlertConfig(config) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      KEYS.configCache,
      JSON.stringify({ config, cachedAt: Date.now() }),
    );
  } catch {}
}

// ── Alert state (tracks last answered time per visitor) ───────────────────────

export function getAlertState() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(KEYS.state);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveAlertState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.state, JSON.stringify(state));
  } catch {}
}

export function clearAlertState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEYS.state);
  } catch {}
}

// ── Show logic ────────────────────────────────────────────────────────────────

export function shouldShowAlert(config) {
  if (!config?.enabled || !config.questions?.length) return false;
  const state = getAlertState();
  if (!state?.answeredAt) return true;
  const diffMs = Date.now() - new Date(state.answeredAt).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= config.durationDays;
}
