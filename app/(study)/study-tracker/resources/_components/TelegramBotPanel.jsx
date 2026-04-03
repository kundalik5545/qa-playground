"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Send,
  Link2,
  Link2Off,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const BOT_URL = "https://t.me/qaplayground_bot";

export default function TelegramBotPanel({ open, onOpenChange, showToast }) {
  const [status, setStatus] = useState(null); // null | { linked, token?, expiresAt?, username?, createdAt? }
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/connect-token");
      if (res.ok) setStatus(await res.json());
    } catch (_) {
      showToast("Failed to load Telegram status", true);
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async () => {
    setGenerating(true);
    setCopied(false);
    try {
      const res = await fetch("/api/telegram/connect-token");
      if (res.ok) setStatus(await res.json());
    } catch (_) {
      showToast("Failed to generate token", true);
    } finally {
      setGenerating(false);
    }
  };

  const disconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch("/api/telegram/connect-token", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setStatus(null);
      showToast("Telegram disconnected");
    } catch (_) {
      showToast("Failed to disconnect Telegram", true);
    } finally {
      setDisconnecting(false);
    }
  };

  const copyToken = (token) => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = (val) => {
    onOpenChange(val);
    if (val) fetchStatus();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent
        className="sm:max-w-md"
        id="telegram-bot-dialog"
        data-testid="telegram-bot-dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send size={16} />
            Telegram Bot
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : status?.linked ? (
          /* ── Already linked ── */
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Link2 size={14} className="text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-green-800">
                  Telegram linked
                </p>
                {status.username && (
                  <p className="text-xs text-green-600">@{status.username}</p>
                )}
                {status.createdAt && (
                  <p className="text-xs text-green-500">
                    Connected on{" "}
                    {new Date(status.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Quick reference
              </p>
              <p className="text-xs text-muted-foreground">
                <code className="bg-muted px-1 rounded">
                  #todo Buy groceries @30min
                </code>
              </p>
              <p className="text-xs text-muted-foreground">
                <code className="bg-muted px-1 rounded">
                  https://example.com #js #tutorial
                </code>
              </p>
              <p className="text-xs text-muted-foreground">
                <code className="bg-muted px-1 rounded">
                  #note Your note content #tag
                </code>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline"
                data-testid="open-telegram-bot-btn"
              >
                <Send size={13} />
                Open Telegram
                <ExternalLink size={11} className="opacity-75" />
              </a>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                    disabled={disconnecting}
                    id="disconnect-telegram-btn"
                    data-testid="disconnect-telegram-btn"
                  >
                    {disconnecting ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Link2Off size={13} />
                    )}
                    Disconnect Telegram
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect Telegram?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your bot messages will stop saving. You can reconnect
                      anytime.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={disconnect}>
                      Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          /* ── Not linked — show connect flow ── */
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Link your Telegram account to save todos, resources, and notes by
              messaging the bot.
            </p>

            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-muted-foreground">
                  Generate a connect token below
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-muted-foreground">
                  Open the bot on Telegram and send:
                  <code className="block mt-1 text-xs bg-muted px-2 py-1 rounded font-mono">
                    /connect &lt;your-token&gt;
                  </code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-muted-foreground">
                  Bot confirms — you&apos;re linked!
                </span>
              </li>
            </ol>

            <div className="flex flex-col gap-2">
              {status?.token ? (
                <>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      Your connect token
                    </p>
                    <div className="flex gap-3 text-xs">
                      {status.createdAt && (
                        <span className="text-muted-foreground">
                          Generated:{" "}
                          {new Date(status.createdAt).toLocaleTimeString(
                            undefined,
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      )}
                      {status.expiresAt && (
                        <span className="text-orange-500 font-medium">
                          Expires:{" "}
                          {new Date(status.expiresAt).toLocaleTimeString(
                            undefined,
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                    <code
                      className="flex-1 text-xs font-mono text-foreground truncate"
                      data-testid="telegram-token-display"
                    >
                      {status.token}
                    </code>
                    <button
                      className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
                      onClick={() => copyToken(status.token)}
                      title="Copy token"
                      data-testid="copy-telegram-token-btn"
                    >
                      {copied ? (
                        <Check size={13} className="text-green-600" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 w-full"
                    onClick={generateToken}
                    disabled={generating}
                    data-testid="refresh-telegram-token-btn"
                  >
                    {generating ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <RefreshCw size={13} />
                    )}
                    Regenerate token
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="gap-1.5 w-full"
                  onClick={generateToken}
                  disabled={generating}
                  id="generate-telegram-token-btn"
                  data-testid="generate-telegram-token-btn"
                >
                  {generating ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  Generate Connect Token
                </Button>
              )}

              {/* Open Telegram bot — always visible */}
              <a
                href={BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline w-full"
                data-testid="open-telegram-bot-btn"
              >
                <Send size={13} />
                Open Telegram
                <ExternalLink size={11} className="opacity-75" />
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center">
          <a
            href="/help/telegram-setup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium transition-colors no-underline"
          >
            <ExternalLink size={11} />
            Setup guide &amp; command reference
          </a>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
