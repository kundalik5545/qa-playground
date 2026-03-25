"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Plus,
  Trash2,
  PauseCircle,
  PlayCircle,
  Save,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function truncate(str, n = 12) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

// ─── Questions Tab ────────────────────────────────────────────────────────────

function QuestionsTab() {
  const [enabled, setEnabled] = useState(true);
  const [durationDays, setDurationDays] = useState(7);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cfgRes, qRes] = await Promise.all([
        fetch("/api/admin/site-alerts/config"),
        fetch("/api/admin/site-alerts/questions"),
      ]);
      if (cfgRes.ok) {
        const cfg = await cfgRes.json();
        setEnabled(cfg.enabled);
        setDurationDays(cfg.durationDays);
      }
      if (qRes.ok) {
        setQuestions(await qRes.json());
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function saveConfig() {
    setSaving(true);
    try {
      await fetch("/api/admin/site-alerts/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, durationDays }),
      });
      toast.success("Config saved");
    } catch {
      toast.error("Failed to save config");
    } finally {
      setSaving(false);
    }
  }

  async function addQuestion() {
    const res = await fetch("/api/admin/site-alerts/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "New question", type: "YESNO" }),
    });
    if (res.ok) {
      const q = await res.json();
      setQuestions((prev) => [...prev, q]);
      toast.success("Question added");
    } else {
      toast.error("Failed to add question");
    }
  }

  async function updateQuestion(id, field, value) {
    // Optimistic update
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
    const res = await fetch(`/api/admin/site-alerts/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok) {
      toast.error("Failed to update question");
      fetchAll(); // revert
    }
  }

  async function toggleActive(q) {
    await updateQuestion(q.id, "isActive", !q.isActive);
  }

  async function moveQuestion(id, direction) {
    const idx = questions.findIndex((q) => q.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= questions.length) return;

    const reordered = [...questions];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    // Update order values
    const updated = reordered.map((q, i) => ({ ...q, order: i }));
    setQuestions(updated);

    // Persist both swapped questions
    await Promise.all([
      fetch(`/api/admin/site-alerts/questions/${reordered[idx].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: idx }),
      }),
      fetch(`/api/admin/site-alerts/questions/${reordered[swapIdx].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: swapIdx }),
      }),
    ]);
  }

  async function deleteQuestion(id) {
    const res = await fetch(`/api/admin/site-alerts/questions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Question deleted");
    } else {
      toast.error("Failed to delete question");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global settings */}
      <Card>
        <CardHeader className="pb-3">
          <h2 className="font-semibold text-base">Global Settings</h2>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable popup</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                When off, the popup will never show to any visitor.
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              id="enable-popup-switch"
              data-testid="enable-popup-switch"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Show again after</Label>
            <Select
              value={String(durationDays)}
              onValueChange={(val) => setDurationDays(Number(val))}
            >
              <SelectTrigger id="duration-select" data-testid="duration-select">
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

          <Button
            onClick={saveConfig}
            disabled={saving}
            className="gap-2"
            id="save-config-btn"
            data-testid="save-config-btn"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Questions list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base">
              Questions
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({questions.length} total, {questions.filter((q) => q.isActive).length} active)
              </span>
            </h2>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={addQuestion}
              id="add-question-btn"
              data-testid="add-question-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No questions yet. Add one above.
            </p>
          )}
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`border rounded-lg p-4 space-y-3 transition-opacity ${
                q.isActive ? "" : "opacity-60"
              }`}
              data-testid={`question-row-${q.id}`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="shrink-0">
                  Q{i + 1}
                </Badge>
                <Badge
                  variant={q.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {q.isActive ? "Active" : "Paused"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {q.type === "YESNO" ? "Yes / No" : "👍 / 👎"}
                </Badge>
                {q._count && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {q._count.responses} response{q._count.responses !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Question text */}
              <div className="space-y-1.5">
                <Label className="text-xs">Question text</Label>
                <Input
                  value={q.text}
                  data-testid={`question-text-${q.id}`}
                  onChange={(e) => {
                    // Local optimistic only — blur saves to DB
                    setQuestions((prev) =>
                      prev.map((x) =>
                        x.id === q.id ? { ...x, text: e.target.value } : x
                      )
                    );
                  }}
                  onBlur={(e) => updateQuestion(q.id, "text", e.target.value.trim())}
                />
              </div>

              {/* Answer type */}
              <div className="space-y-1.5">
                <Label className="text-xs">Answer type</Label>
                <Select
                  value={q.type}
                  onValueChange={(val) => updateQuestion(q.id, "type", val)}
                >
                  <SelectTrigger data-testid={`question-type-${q.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YESNO">Yes / No buttons</SelectItem>
                    <SelectItem value="THUMBS">👍 / 👎 Thumbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2 pt-1">
                {/* Reorder */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  disabled={i === 0}
                  onClick={() => moveQuestion(q.id, -1)}
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  disabled={i === questions.length - 1}
                  onClick={() => moveQuestion(q.id, 1)}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>

                {/* Pause / Resume */}
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 ml-1"
                  onClick={() => toggleActive(q)}
                  data-testid={`toggle-active-${q.id}`}
                  data-action={q.isActive ? "pause-question" : "resume-question"}
                >
                  {q.isActive ? (
                    <>
                      <PauseCircle className="h-3.5 w-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3.5 w-3.5" /> Resume
                    </>
                  )}
                </Button>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 ml-auto text-destructive hover:text-destructive"
                      data-testid={`delete-question-${q.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete question?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the question and all{" "}
                        {q._count?.responses ?? 0} responses associated with it.
                        This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteQuestion(q.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Responses Tab ────────────────────────────────────────────────────────────

function ResponsesTab() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterQ, setFilterQ] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 50;

  const fetchResponses = useCallback(
    async (questionId, pg) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: pg, limit });
        if (questionId !== "all") params.set("questionId", questionId);
        const res = await fetch(`/api/admin/site-alerts/responses?${params}`);
        if (res.ok) {
          const data = await res.json();
          setResponses(data.responses);
          setTotal(data.total);
        }
      } catch {
        toast.error("Failed to load responses");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetch("/api/admin/site-alerts/questions")
      .then((r) => r.json())
      .then(setQuestions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchResponses(filterQ, page);
  }, [filterQ, page, fetchResponses]);

  // Aggregate counts per question from current page
  const yesAnswers = new Set(["Yes", "Liked it"]);
  const aggregate = responses.reduce((acc, r) => {
    if (!acc[r.questionId]) {
      acc[r.questionId] = { text: r.questionText, yes: 0, no: 0, total: 0 };
    }
    acc[r.questionId].total++;
    if (yesAnswers.has(r.answer)) acc[r.questionId].yes++;
    else acc[r.questionId].no++;
    return acc;
  }, {});

  function exportCSV() {
    const header = "Question,Answer,Visitor ID,Date";
    const rows = responses.map(
      (r) =>
        `"${r.questionText.replace(/"/g, '""')}","${r.answer}","${r.visitorId}","${formatDate(r.createdAt)}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-alert-responses-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      {Object.keys(aggregate).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(aggregate).map(([qId, agg]) => (
            <Card key={qId} className="p-4">
              <p className="text-sm font-medium mb-2 leading-snug">{agg.text}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 font-semibold">
                  Yes / Liked: {agg.yes}
                </span>
                <span className="text-red-500 font-semibold">
                  No / Disliked: {agg.no}
                </span>
                <span className="text-muted-foreground ml-auto">
                  Total: {agg.total}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Filter + export row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={filterQ}
          onValueChange={(val) => {
            setFilterQ(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-56" id="filter-question" data-testid="filter-question">
            <SelectValue placeholder="All questions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All questions</SelectItem>
            {questions.map((q) => (
              <SelectItem key={q.id} value={q.id}>
                {q.text.length > 40 ? q.text.slice(0, 40) + "…" : q.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchResponses(filterQ, page)}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          disabled={responses.length === 0}
          className="ml-auto"
          data-testid="export-csv-btn"
        >
          Export CSV
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : responses.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          No responses yet.
        </p>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              id="responses-table"
              data-testid="responses-table"
            >
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Question</th>
                  <th className="px-4 py-3 font-medium">Answer</th>
                  <th className="px-4 py-3 font-medium">Visitor</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b last:border-0 hover:bg-muted/40"
                    data-testid={`response-row-${r.id}`}
                  >
                    <td className="px-4 py-3 max-w-[200px]">
                      <span title={r.questionText}>
                        {r.questionText.length > 45
                          ? r.questionText.slice(0, 45) + "…"
                          : r.questionText}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          yesAnswers.has(r.answer) ? "default" : "secondary"
                        }
                      >
                        {r.answer}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {truncate(r.visitorId, 16)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SiteAlertsAdminPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user?.role !== "ADMIN") {
      router.replace("/study-tracker/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending || !session || session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" id="site-alerts-title">
              Site Alerts
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage the feedback popup shown to homepage visitors.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => router.push("/admin/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="questions" id="site-alerts-tabs" data-testid="site-alerts-tabs">
          <TabsList className="w-full" id="site-alerts-tabs-list">
            <TabsTrigger
              value="questions"
              className="flex-1"
              id="tab-questions"
              data-testid="tab-questions"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="flex-1"
              id="tab-responses"
              data-testid="tab-responses"
            >
              Responses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-6">
            <QuestionsTab />
          </TabsContent>

          <TabsContent value="responses" className="mt-6">
            <ResponsesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
