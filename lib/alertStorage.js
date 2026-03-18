import { basicDetails } from "@/data/BasicSetting";

const KEYS = {
  config: "qaPlayground_alertConfig",
  state: "qaPlayground_alertState",
};

export const DEFAULT_ALERT_CONFIG = {
  enabled: true,
  durationDays: 1,
  formspreeEndpoint: "",
  questions: [
    {
      id: "q1",
      text: "Have you tried our new Study Tracker?",
      type: "yesno",
    },
    {
      id: "q2",
      text: "Did you like it?",
      type: "thumbs",
    },
  ],
};

export function getAlertConfig() {
  // Always use BasicSetting.formspreeEndpoint as the canonical fallback
  const codeEndpoint = basicDetails.formspreeEndpoint || "";

  if (typeof window === "undefined") {
    return { ...DEFAULT_ALERT_CONFIG, formspreeEndpoint: codeEndpoint };
  }
  try {
    const stored = localStorage.getItem(KEYS.config);
    const base = stored
      ? { ...DEFAULT_ALERT_CONFIG, ...JSON.parse(stored) }
      : { ...DEFAULT_ALERT_CONFIG };
    // If localStorage config has no endpoint, fall back to BasicSetting value
    if (!base.formspreeEndpoint) base.formspreeEndpoint = codeEndpoint;
    return base;
  } catch {}
  return { ...DEFAULT_ALERT_CONFIG, formspreeEndpoint: codeEndpoint };
}

export function saveAlertConfig(config) {
  localStorage.setItem(KEYS.config, JSON.stringify(config));
}

export function getAlertState() {
  try {
    const stored = localStorage.getItem(KEYS.state);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveAlertState(state) {
  localStorage.setItem(KEYS.state, JSON.stringify(state));
}

export function clearAlertState() {
  localStorage.removeItem(KEYS.state);
}

export function shouldShowAlert(config) {
  if (!config.enabled || !config.questions?.length) return false;
  const state = getAlertState();
  if (!state?.answeredAt) return true;
  const diffMs = Date.now() - new Date(state.answeredAt).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= config.durationDays;
}
