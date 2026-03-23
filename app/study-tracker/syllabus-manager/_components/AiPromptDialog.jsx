"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const AI_PROMPT = `Generate a QA study syllabus in the exact JSON format below.
Respond with valid JSON only — no explanation, no markdown code fences.

{
  "version": 1,
  "type": "qa-tracker-syllabus",
  "exportedAt": "<current ISO timestamp>",
  "syllabus": {
    "id": "<short-lowercase-id>",
    "label": "<Display Name>",
    "icon": "<single emoji>",
    "color": "<hex color code>",
    "sections": [
      {
        "id": "<syllabus-id>-s1",
        "title": "<Section Title>",
        "topics": [
          {
            "id": "<syllabus-id>-t1",
            "title": "<Topic Title>",
            "subtopics": [
              "<Subtopic 1>",
              "<Subtopic 2>",
              "<Subtopic 3>"
            ],
            "resources": []
          }
        ]
      }
    ]
  }
}

Topic: [REPLACE WITH YOUR TOPIC — e.g. "Cypress Automation Testing"]

Guidelines:
- Include 4–6 sections with 3–5 topics each
- Keep subtopics concise (3–4 per topic)
- Use a relevant single emoji for icon
- Use a hex color that suits the topic
- IDs must be lowercase, hyphen-separated, unique`;

export default function AiPromptDialog({ open, onOpenChange }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(AI_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Prompt</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Copy this into ChatGPT, Claude, or Gemini. Replace the topic at the
            bottom, then import the result.
          </p>
        </DialogHeader>

        <div className="space-y-3">
          <textarea
            readOnly
            value={AI_PROMPT}
            rows={20}
            className="w-full rounded-md border bg-muted/40 p-3 text-xs font-mono leading-relaxed resize-none focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-1 h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-4 w-4" />
                  Copy Prompt
                </>
              )}
            </Button>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
