"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutGrid,
  List,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  X,
  Loader2,
  LogIn,
  Copy,
  Check,
  KeyRound,
  Download,
  Globe,
  Send,
} from "lucide-react";
import TelegramBotPanel from "./telegram-bot/TelegramBotPanel";
import { useTracker } from "../../_components/StudyTrackerProvider";
import {
  CHROME_EXTENSIONS,
  EMPTY_FORM,
  RESOURCE_TYPES,
  SHOW_EXTENSION_CARDS,
  TYPE_LABELS,
} from "./resource-constant";
import ResourceCard from "./ResourceCard";

export default function ResourcesView({ showToast }) {
  const { user, sessionPending: isPending } = useTracker();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "table" | "card"

  // Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterTag, setFilterTag] = useState("");

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Cache: cacheKey (URLSearchParams string) → resource array
  const cacheRef = useRef({});
  // Abort controller for the current in-flight fetch
  const abortControllerRef = useRef(null);

  // API Keys panel
  const [keysOpen, setKeysOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  // Telegram Bot panel
  const [telegramOpen, setTelegramOpen] = useState(false);
  // Set of ext IDs whose DOM sentinel element is present in the page
  const [installedExtIds, setInstalledExtIds] = useState(new Set());

  const isLoggedIn = !!user;

  useEffect(() => {
    // Each Chrome extension injects a hidden <div id="<domId>"> when active.
    // We check for those elements to know which extensions are installed.
    const installed = new Set(
      CHROME_EXTENSIONS.filter((ext) => document.getElementById(ext.domId)).map(
        (ext) => ext.id,
      ),
    );
    setInstalledExtIds(installed);
  }, []);

  const fetchResources = useCallback(
    async (forceRefresh = false) => {
      if (!isLoggedIn) return;
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterType !== "ALL") params.set("type", filterType);
      if (filterTag) params.set("tag", filterTag);
      const cacheKey = params.toString();

      if (!forceRefresh && cacheRef.current[cacheKey]) {
        setResources(cacheRef.current[cacheKey]);
        return;
      }

      // Cancel any previous in-flight request before starting a new one
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const res = await fetch(`/api/resources?${params}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          cacheRef.current[cacheKey] = data;
          setResources(data);
        }
      } catch (err) {
        if (err.name !== "AbortError")
          showToast("Failed to load resources", true);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, search, filterType, filterTag, showToast],
  );

  useEffect(() => {
    fetchResources();
    return () => abortControllerRef.current?.abort();
  }, [fetchResources]);

  const fetchApiKeys = async () => {
    setKeysLoading(true);
    try {
      const res = await fetch("/api/api-keys");
      if (res.ok) setApiKeys(await res.json());
    } finally {
      setKeysLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTagInput("");
    setDialogOpen(true);
  };

  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({
      resourceType: r.resourceType,
      title: r.title,
      url: r.url,
      description: r.description || "",
      tags: r.tags.map((t) => t.toLowerCase()),
      image: r.image || "",
    });
    setTagInput("");
    setDialogOpen(true);
  };

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags : [...f.tags, tag],
    }));
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSave = async () => {
    if (!form.resourceType || !form.title || !form.url) {
      showToast("Type, title and URL are required", true);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        resourceType: form.resourceType,
        title: form.title.trim(),
        url: form.url.trim(),
        description: form.description.trim() || null,
        tags: form.tags.map((t) => t.toLowerCase()),
        image: form.image.trim() || null,
      };
      const res = editingId
        ? await fetch(`/api/resources/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) throw new Error();
      showToast(editingId ? "Resource updated!" : "Resource added!");
      setDialogOpen(false);
      cacheRef.current = {};
      fetchResources(true);
    } catch (_) {
      showToast("Failed to save resource", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Resource deleted");
      cacheRef.current = {};
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (_) {
      showToast("Failed to delete resource", true);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName || "Chrome Extension" }),
      });
      if (!res.ok) throw new Error();
      setNewKeyName("");
      fetchApiKeys();
      showToast("API key generated!");
    } catch (_) {
      showToast("Failed to generate key", true);
    }
  };

  const handleDeleteKey = async (id) => {
    try {
      const res = await fetch("/api/api-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      showToast("Key revoked");
    } catch (_) {
      showToast("Failed to revoke key", true);
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Collect all unique tags for filter suggestions
  const allTags = [
    ...new Set(resources.flatMap((r) => r.tags.map((t) => t.toLowerCase()))),
  ].sort();

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isPending && !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-[360px] bg-white border border-[#e9eaed] rounded-2xl px-10 py-10">
          <div className="text-[3rem] mb-4">🔒</div>
          <h2 className="text-lg font-semibold text-[#1f2937] mb-2">
            Sign in to access Resources
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Save articles, videos, courses and tools you&apos;re learning from.
            Log in to get started.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors no-underline"
          >
            <LogIn size={16} />
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // ── Loading session ────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#1f2937] m-0">Resources</h1>
          <span className="text-[0.75rem] font-semibold bg-gray-100 text-gray-500 px-[9px] py-[3px] rounded-full font-mono">
            {resources.length} saved
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 dark:text-white"
            onClick={() => setTelegramOpen(true)}
            id="telegram-bot-btn"
            data-testid="telegram-bot-btn"
          >
            <Send size={14} />
            Telegram Bot
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 dark:text-white"
            onClick={() => {
              setKeysOpen(true);
              fetchApiKeys();
            }}
            id="manage-api-keys-btn"
            data-testid="manage-api-keys-btn"
          >
            <KeyRound size={14} />
            API Keys
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={openAdd}
            id="add-resource-btn"
            data-testid="add-resource-btn"
          >
            <Plus size={14} />
            Add Resource
          </Button>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="w-full border border-[#e9eaed] rounded-lg pl-8 pr-8 py-2 text-sm text-[#374151] bg-white outline-none focus:border-blue-600 transition-colors"
            placeholder="Search title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="resource-search"
            data-testid="resource-search"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition-colors p-0 flex items-center"
              onClick={() => setSearch("")}
            >
              <X size={12} />
            </button>
          )}
        </div>

        <select
          className="border border-[#e9eaed] rounded-lg px-3 py-2 text-sm text-[#374151] bg-white outline-none focus:border-blue-600 transition-colors cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          id="resource-type-filter"
          data-testid="resource-type-filter"
        >
          <option value="ALL">All Types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>

        {allTags.length > 0 && (
          <select
            className="border border-[#e9eaed] rounded-lg px-3 py-2 text-sm text-[#374151] bg-white outline-none focus:border-blue-600 transition-colors cursor-pointer"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            id="resource-tag-filter"
            data-testid="resource-tag-filter"
          >
            <option value="">All Tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <div className="flex border border-[#e9eaed] rounded-lg overflow-hidden">
          <button
            className={cn(
              "px-3 py-[7px] bg-white border-none cursor-pointer text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors flex items-center",
              viewMode === "table" &&
                "bg-[#eff2ff] text-blue-600 hover:bg-[#eff2ff] hover:text-blue-600",
            )}
            onClick={() => setViewMode("table")}
            title="Table view"
            id="view-table-btn"
            data-testid="view-table-btn"
          >
            <List size={15} />
          </button>
          <button
            className={cn(
              "px-3 py-[7px] bg-white border-none cursor-pointer text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors flex items-center border-l border-[#e9eaed]",
              viewMode === "card" &&
                "bg-[#eff2ff] text-blue-600 hover:bg-[#eff2ff] hover:text-blue-600",
            )}
            onClick={() => setViewMode("card")}
            title="Card view"
            id="view-card-btn"
            data-testid="view-card-btn"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* ── PINNED CHROME EXTENSION CARDS ── */}
      {SHOW_EXTENSION_CARDS &&
        CHROME_EXTENSIONS.some((ext) => !installedExtIds.has(ext.id)) && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5"
            id="ext-cards-grid"
            data-testid="ext-cards-grid"
          >
            {CHROME_EXTENSIONS.filter(
              (ext) => !installedExtIds.has(ext.id),
            ).map((ext) => (
              <div
                key={ext.id}
                className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden flex flex-col hover:shadow-sm transition-shadow h-full"
                data-testid={`ext-card-${ext.id}`}
              >
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1 px-[9px] py-[3px] rounded-full text-[0.72rem] font-semibold"
                      style={{ background: "#eff6ff", color: "#2563eb" }}
                    >
                      <Globe size={10} />
                      Extension
                    </span>
                    <span className="text-[0.68rem] font-semibold text-blue-400 uppercase tracking-wide">
                      Pinned
                    </span>
                  </div>
                  <span className="font-medium text-[#1f2937] inline-flex items-center gap-1 text-sm">
                    <ext.Icon
                      size={14}
                      className="text-blue-500 flex-shrink-0"
                    />
                    {ext.title}
                  </span>
                  {ext.description && (
                    <p className="text-[0.77rem] text-gray-500 line-clamp-2 m-0">
                      {ext.description}
                    </p>
                  )}
                  <a
                    href={ext.installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-1 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[0.77rem] font-medium px-3 py-1.5 rounded-lg transition-colors no-underline w-fit"
                    data-testid={`ext-install-${ext.id}`}
                  >
                    <Download size={12} />
                    Install Extension
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* ── CONTENT ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-[3rem] mb-3">📚</div>
          <p className="text-base font-semibold text-[#1f2937] mb-1">
            No resources yet
          </p>
          <p className="text-sm text-gray-500">
            Add your first resource to get started.
          </p>
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto rounded-xl border border-[#e9eaed] bg-white">
          <table
            className="w-full border-collapse text-sm"
            id="resources-table"
            data-testid="resources-table"
          >
            <thead>
              <tr className="border-b border-[#e9eaed] bg-[#f8f9fc]">
                <th className="text-left px-4 py-3 text-[0.75rem] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-[0.75rem] font-semibold text-gray-500 uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-[0.75rem] font-semibold text-gray-500 uppercase tracking-wide">
                  Tags
                </th>
                <th className="text-left px-4 py-3 text-[0.75rem] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Added
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#f0f1f4] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
                  data-testid={`resource-row-${r.id}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-[9px] py-[3px] rounded-full text-[0.72rem] font-semibold"
                      style={TYPE_COLORS[r.resourceType]}
                    >
                      {TYPE_LABELS[r.resourceType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-52 xl:max-w-80 overflow-hidden">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#1f2937] no-underline hover:text-blue-600 hover:underline inline-flex items-center gap-1 transition-colors"
                      data-testid={`resource-title-${r.id}`}
                    >
                      {r.title}
                      <ExternalLink
                        size={11}
                        className="text-gray-400 flex-shrink-0"
                      />
                    </a>
                    {r.description && (
                      <p className="text-[0.77rem] text-gray-500 mt-[3px] m-0 line-clamp-1">
                        {r.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-600 text-[0.72rem] px-[7px] py-[2px] rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => setFilterTag(tag)}
                          title={`Filter by "${tag}"`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[0.77rem] text-gray-400 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-transparent border-none cursor-pointer text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        onClick={() => openEdit(r)}
                        title="Edit"
                        data-testid={`edit-resource-${r.id}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-transparent border-none cursor-pointer text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Delete"
                            data-testid={`delete-resource-${r.id}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete resource?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              &ldquo;{r.title}&rdquo; will be permanently
                              deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(r.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          id="resources-card-grid"
          data-testid="resources-card-grid"
        >
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              r={r}
              onEdit={openEdit}
              onDelete={handleDelete}
              onFilterByTag={setFilterTag}
            />
          ))}
        </div>
      )}

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-lg"
          id="resource-dialog"
          data-testid="resource-dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="res-type">Type *</Label>
              <Select
                value={form.resourceType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, resourceType: v }))
                }
              >
                <SelectTrigger id="res-type" data-testid="res-type-select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="res-title">Title *</Label>
              <Input
                id="res-title"
                data-testid="res-title-input"
                placeholder="Resource title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="res-url">URL *</Label>
              <Input
                id="res-url"
                data-testid="res-url-input"
                type="url"
                placeholder="https://..."
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="res-desc">Description</Label>
              <Textarea
                id="res-desc"
                data-testid="res-desc-input"
                placeholder="Brief description…"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="res-tags">Tags</Label>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-[#eff2ff] border border-[#c7d2fe] text-blue-700 text-[0.72rem] px-[8px] py-[3px] rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        className="bg-transparent border-none cursor-pointer text-blue-400 hover:text-red-500 p-0 flex items-center transition-colors"
                        onClick={() => removeTag(tag)}
                        data-testid={`remove-tag-${tag}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  id="res-tags"
                  data-testid="res-tags-input"
                  placeholder="Type a tag and press Enter…"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag(tagInput)}
                  data-testid="add-tag-btn"
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              {allTags.filter(
                (t) =>
                  !form.tags.includes(t) && t.includes(tagInput.toLowerCase()),
              ).length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  <span className="text-[0.72rem] text-gray-500">
                    Suggestions:
                  </span>
                  {allTags
                    .filter(
                      (t) =>
                        !form.tags.includes(t) &&
                        (!tagInput || t.includes(tagInput.toLowerCase())),
                    )
                    .slice(0, 8)
                    .map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="inline-block bg-gray-100 text-gray-600 text-[0.72rem] px-[7px] py-[2px] rounded-full cursor-pointer hover:bg-gray-200 border-none transition-colors"
                        onClick={() => addTag(t)}
                        data-testid={`suggest-tag-${t}`}
                      >
                        {t}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="res-image">Image URL (optional)</Label>
              <Input
                id="res-image"
                data-testid="res-image-input"
                type="url"
                prefetch={false}
                placeholder="https://..."
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              id="save-resource-btn"
              data-testid="save-resource-btn"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Add Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── API KEYS DIALOG ── */}
      <Dialog open={keysOpen} onOpenChange={setKeysOpen}>
        <DialogContent
          className="sm:max-w-lg"
          id="api-keys-dialog"
          data-testid="api-keys-dialog"
        >
          <DialogHeader>
            <DialogTitle>API Keys — QA Playground Clipper</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Use this key in the{" "}
            <span className="font-medium text-foreground">
              QA Playground Clipper
            </span>{" "}
            Chrome extension to save any resource directly to your Resources
            list from any webpage — no copy-paste needed.
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Key name (e.g. My Extension)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              id="new-key-name"
              data-testid="new-key-name-input"
            />
            <Button
              onClick={handleGenerateKey}
              id="generate-key-btn"
              data-testid="generate-key-btn"
            >
              Generate
            </Button>
          </div>

          {keysLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No API keys yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center gap-2 p-2 rounded border bg-muted/30"
                  data-testid={`api-key-row-${k.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{k.name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {k.key}
                    </p>
                  </div>
                  <button
                    className="shrink-0 p-1 rounded hover:bg-muted"
                    onClick={() => copyKey(k.key)}
                    title="Copy key"
                    data-testid={`copy-key-${k.id}`}
                  >
                    {copiedKey === k.key ? (
                      <Check size={13} className="text-green-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="shrink-0 p-1 rounded hover:bg-muted text-destructive"
                        title="Revoke"
                        data-testid={`revoke-key-${k.id}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke key?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Any extension using &ldquo;{k.name}&rdquo; will stop
                          working.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteKey(k.id)}
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setKeysOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── TELEGRAM BOT PANEL ── */}
      <TelegramBotPanel
        open={telegramOpen}
        onOpenChange={setTelegramOpen}
        showToast={showToast}
      />
    </div>
  );
}
