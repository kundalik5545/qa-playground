"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCachedAlertConfig,
  setCachedAlertConfig,
  shouldShowAlert,
  saveAlertState,
  getVisitorId,
} from "@/lib/alertStorage";

export default function SiteAlertPopup() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      // 1. Try the local cache first (no network delay)
      let cfg = getCachedAlertConfig();

      if (!cfg) {
        try {
          const res = await fetch("/api/public/site-alerts/config");
          if (res.ok) {
            cfg = await res.json();
            setCachedAlertConfig(cfg);
          }
        } catch {
          // Silently fail — don't block the page for a popup
        }
      }

      if (!cfg) return;

      setConfig(cfg);
      if (shouldShowAlert(cfg)) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }

    loadConfig();
  }, []);

  async function handleAnswer(questionId, answer) {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    const isLast = step >= config.questions.length - 1;

    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    // Last question answered — save local state to suppress re-show
    saveAlertState({ answeredAt: new Date().toISOString() });
    setDone(true);
    setTimeout(() => setVisible(false), 2000);

    // Submit to DB
    const visitorId = getVisitorId();
    if (visitorId) {
      try {
        const responses = config.questions.map((q) => ({
          questionId: q.id,
          answer: newAnswers[q.id] ?? "—",
        }));
        await fetch("/api/public/site-alerts/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, responses }),
        });
      } catch (err) {
        console.error("Alert submit failed:", err);
      }
    }
  }

  function handleDismiss() {
    setVisible(false);
  }

  if (!visible || !config) return null;

  const currentQ = config.questions[step];
  const total = config.questions.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Quick feedback"
    >
      <div className="bg-card border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {done ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold">Thanks for your feedback!</p>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="flex gap-1.5 mb-4">
              {config.questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-1">
              Question {step + 1} of {total}
            </p>
            <p className="text-base font-semibold mb-5 leading-snug">
              {currentQ.text}
            </p>

            {currentQ.type === "yesno" && (
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => handleAnswer(currentQ.id, "Yes")}
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAnswer(currentQ.id, "No")}
                >
                  No
                </Button>
              </div>
            )}

            {currentQ.type === "thumbs" && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleAnswer(currentQ.id, "Liked it")}
                >
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleAnswer(currentQ.id, "Did not like")}
                >
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  No
                </Button>
              </div>
            )}

            <button
              onClick={handleDismiss}
              className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ask me later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
