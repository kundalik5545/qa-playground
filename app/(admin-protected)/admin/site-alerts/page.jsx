"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, RefreshCw, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  getAlertConfig,
  saveAlertConfig,
  clearAlertState,
  getAlertState,
  DEFAULT_ALERT_CONFIG,
} from "@/lib/alertStorage";

export default function SiteAlertsAdmin() {
  const [config, setConfig] = useState(DEFAULT_ALERT_CONFIG);
  const [alertState, setAlertState] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    setConfig(getAlertConfig());
    setAlertState(getAlertState());
  }, []);

  function handleSave() {
    saveAlertConfig(config);
    toast.success("Settings saved!");
  }

  function handleReset() {
    clearAlertState();
    setAlertState(null);
    toast.success("State cleared — popup will show on next homepage visit.");
  }

  function updateQuestion(index, field, value) {
    setConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  }

  function deleteQuestion(index) {
    setConfig((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  }

  function addQuestion() {
    setConfig((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { id: `q${Date.now()}`, text: "New question", type: "yesno" },
      ],
    }));
  }

  const lastAnswered = alertState?.answeredAt
    ? new Date(alertState.answeredAt).toLocaleString()
    : null;

  const nextShowDate =
    alertState?.answeredAt
      ? new Date(
          new Date(alertState.answeredAt).getTime() +
            config.durationDays * 24 * 60 * 60 * 1000
        ).toLocaleDateString()
      : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Alert Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure the popup shown to visitors on the homepage. Responses are
          stored in the database.
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <h2 className="font-semibold text-base">Current Status</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Popup status</span>
            <Badge variant={config.enabled ? "default" : "secondary"}>
              {config.enabled ? "Active" : "Disabled"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Last visitor response</span>
            <span>{lastAnswered ?? "Never"}</span>
          </div>
          {nextShowDate && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Shows again after</span>
              <span>{nextShowDate}</span>
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            className="gap-2 mt-1"
            onClick={handleReset}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset — show popup again now
          </Button>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader className="pb-3">
          <h2 className="font-semibold text-base">General Settings</h2>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable popup</Label>
              <p className="text-xs text-muted-foreground">
                When off, the popup will never show.
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(val) =>
                setConfig((prev) => ({ ...prev, enabled: val }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>Show again after</Label>
            <Select
              value={String(config.durationDays)}
              onValueChange={(val) =>
                setConfig((prev) => ({ ...prev, durationDays: Number(val) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every day</SelectItem>
                <SelectItem value="3">Every 3 days</SelectItem>
                <SelectItem value="7">Every week</SelectItem>
                <SelectItem value="14">Every 2 weeks</SelectItem>
                <SelectItem value="30">Every month</SelectItem>
                <SelectItem value="90">Every 3 months</SelectItem>
                <SelectItem value="365">Once a year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base">Questions</h2>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={addQuestion}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No questions configured. Add one above.
            </p>
          )}
          {config.questions.map((q, i) => (
            <div key={q.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">
                  Q{i + 1}
                </Badge>
                <button
                  onClick={() => deleteQuestion(i)}
                  className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Question text</Label>
                <Input
                  value={q.text}
                  onChange={(e) => updateQuestion(i, "text", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Answer type</Label>
                <Select
                  value={q.type}
                  onValueChange={(val) => updateQuestion(i, "type", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesno">Yes / No buttons</SelectItem>
                    <SelectItem value="thumbs">
                      Thumbs up / Thumbs down
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="pb-3">
          <h2 className="font-semibold text-base">Preview</h2>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setPreviewVisible(true)}
          >
            <Eye className="h-4 w-4" />
            Preview popup
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Preview does not save responses or clear state.
          </p>
        </CardContent>
      </Card>

      <Button className="w-full gap-2" size="lg" onClick={handleSave}>
        <Save className="h-4 w-4" />
        Save Settings
      </Button>

      {previewVisible && config.questions.length > 0 && (
        <AlertPreview
          config={config}
          onClose={() => setPreviewVisible(false)}
        />
      )}
    </div>
  );
}

function AlertPreview({ config, onClose }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const currentQ = config.questions[step];

  function handleAnswer() {
    if (step < config.questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
      setTimeout(onClose, 1500);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold">Thanks for your feedback!</p>
          </div>
        ) : (
          <>
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
              Question {step + 1} of {config.questions.length}
            </p>
            <p className="text-base font-semibold mb-5 leading-snug">
              {currentQ.text}
            </p>
            {currentQ.type === "yesno" && (
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleAnswer}>
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAnswer}
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
                  onClick={handleAnswer}
                >
                  👍 Yes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleAnswer}
                >
                  👎 No
                </Button>
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Ask me later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
