import { basicDetails } from "@/data/BasicSetting";
import {
  Send,
  CheckCircle2,
  Globe,
  FileText,
  Clock,
  Hash,
  MessageSquare,
  ExternalLink,
  Link2,
} from "lucide-react";

export const metadata = {
  title: "Telegram Bot | QA Playground",
  description:
    "Save todos, resources, and notes to QA Playground directly from Telegram. Link your account and start in minutes.",
  alternates: {
    canonical: `${basicDetails.websiteURL}/telegram-setup`,
  },
  openGraph: {
    title: "Telegram Bot | QA Playground",
    description:
      "Save todos, resources, and notes to QA Playground directly from Telegram.",
    url: `${basicDetails.websiteURL}/telegram-setup`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
};

const BOT_USERNAME = "qaplayground_bot";
const BOT_URL = `https://t.me/${BOT_USERNAME}`;

function StepNumber({ n }) {
  return (
    <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
      {n}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <code className="block bg-gray-900 text-green-400 text-sm font-mono px-4 py-3 rounded-lg mt-2 whitespace-pre-wrap break-all">
      {children}
    </code>
  );
}

function InlineCode({ children }) {
  return (
    <code className="bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-sm font-mono px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

function CommandCard({ trigger, description, examples }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <InlineCode>{trigger}</InlineCode>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
      <div className="px-4 py-3 space-y-1">
        {examples.map((ex, i) => (
          <CodeBlock key={i}>{ex}</CodeBlock>
        ))}
      </div>
    </div>
  );
}

export default function TelegramSetupPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* ── Hero ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-5">
          <Send size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          QA Playground Telegram Bot
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed mb-6">
          Save todos, resources, and notes to your QA Playground account directly
          from Telegram — no app switching, no forms to fill.
        </p>

        {/* Open bot button */}
        <a
          href={BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors no-underline text-sm"
        >
          <Send size={16} />
          Open @{BOT_USERNAME} on Telegram
          <ExternalLink size={13} className="opacity-70" />
        </a>
      </div>

      {/* ── What you can save ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: CheckCircle2,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950",
            title: "Todos",
            desc: "Add tasks to your Daily Tracker with optional time estimates",
          },
          {
            icon: Globe,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-950",
            title: "Resources",
            desc: "Paste a URL — title and image are pulled automatically",
          },
          {
            icon: FileText,
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-950",
            title: "Notes",
            desc: "Save thoughts, tips, and snippets with category tags",
          },
        ].map(({ icon: Icon, color, bg, title, desc }) => (
          <div
            key={title}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center"
          >
            <div className={`inline-flex w-10 h-10 rounded-full ${bg} items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── How to get started ── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          How to get started
        </h2>

        <div className="space-y-8">

          <div className="flex gap-4">
            <StepNumber n={1} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Open the bot on Telegram
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Click the button below to open the bot, then press{" "}
                <strong className="text-gray-700 dark:text-gray-300">Start</strong>.
              </p>
              <a
                href={BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline"
              >
                <Send size={14} />
                Open @{BOT_USERNAME}
                <ExternalLink size={12} className="opacity-70" />
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <StepNumber n={2} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Generate a connect token
              </h3>
              <p className="text-sm text-gray-500">
                Go to{" "}
                <a href="/study-tracker" className="text-blue-600 hover:underline font-medium">
                  Study Tracker → Resources
                </a>
                , click the{" "}
                <strong className="text-gray-700 dark:text-gray-300">Telegram Bot</strong>{" "}
                button, and click{" "}
                <strong className="text-gray-700 dark:text-gray-300">Generate Connect Token</strong>.
                You will get a one-time token that looks like:
              </p>
              <CodeBlock>qatg_a1b2c3d4e5f6...</CodeBlock>
              <p className="text-xs text-gray-400 mt-2">
                Token expires in 15 minutes. You can regenerate it anytime.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <StepNumber n={3} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Send the token to the bot
              </h3>
              <p className="text-sm text-gray-500">
                In Telegram, send this message to the bot (replace with your actual token):
              </p>
              <CodeBlock>/connect qatg_a1b2c3d4e5f6...</CodeBlock>
              <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                Bot replies: Telegram linked to your QA Playground account!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <StepNumber n={4} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Start saving
              </h3>
              <p className="text-sm text-gray-500">
                That&apos;s it! Now just message the bot and everything gets saved to
                your account automatically. See the command reference below.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Command reference ── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Command reference
        </h2>

        <div className="space-y-4">
          <CommandCard
            trigger="#todo"
            description="Save a task to your Daily Tracker"
            examples={[
              "#todo Learn GitHub Actions",
              "#todo Review PR @30min",
              "#todo Study Selenium @1hr",
            ]}
          />
          <CommandCard
            trigger="URL"
            description="Paste any link to save as a Resource"
            examples={[
              "https://javascript.info",
              'https://example.com/guide #js #tutorial',
              'https://example.com "Custom description" #selenium',
            ]}
          />
          <CommandCard
            trigger="#note"
            description="Save a note with optional category tags"
            examples={[
              "#note Use data-testid for stable locators #selenium",
              "#note Always add explicit waits before assertions #playwright #tips",
            ]}
          />
          <CommandCard
            trigger="/help"
            description="Show the command reference inside Telegram"
            examples={["/help"]}
          />
        </div>

        {/* Quick rules */}
        <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Good to know
            </p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              {
                icon: Clock,
                label: "Time",
                value: "Optional in todos. Use @30min, @1hr, @2h after the task title.",
              },
              {
                icon: Hash,
                label: "Tags",
                value: "Optional everywhere. Add #tag anywhere. For notes, the first tag becomes the category.",
              },
              {
                icon: MessageSquare,
                label: "Description",
                value: 'Optional for resources. Wrap in double quotes: "my description".',
              },
              {
                icon: Globe,
                label: "Auto-extract",
                value: "For URLs, the bot automatically fetches the page title and preview image. You can edit these later on the Resources page.",
              },
              {
                icon: Link2,
                label: "Unlink",
                value: "To disconnect your Telegram account, go to Resources → Telegram Bot → Disconnect.",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 px-4 py-3">
                <Icon size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {label}:{" "}
                  </span>
                  <span className="text-xs text-gray-500">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="text-center rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-8">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          Ready to start?
        </p>
        <p className="text-sm text-gray-500 mb-5">
          Link your account in under a minute.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl transition-colors no-underline text-sm"
          >
            <Send size={14} />
            Open Bot on Telegram
          </a>
          <a
            href="/study-tracker"
            className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium px-5 py-2.5 rounded-xl transition-colors no-underline text-sm"
          >
            Go to Resources
          </a>
        </div>
      </div>

    </div>
  );
}
