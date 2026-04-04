"use client";

import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.css";
import styles from "./markdown.module.css";
import Link from "next/link";
import { 
  Home, 
  ChevronRight, 
  Download, 
  FileText, 
  Upload, 
  ExternalLink, 
  Code, 
  ArrowRight,
  FileJson
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Global Marked Configuration for Code Blocks natively bound to parser
const renderer = new marked.Renderer();
renderer.code = function(arg1, arg2) {
  // Support both marked v13+ object token signature and older separate argument signature
  const text = typeof arg1 === "object" ? arg1.text : arg1;
  const lang = typeof arg1 === "object" ? arg1.lang : arg2;
  const language = (lang && hljs.getLanguage(lang)) ? lang : "plaintext";
  const highlightedCode = hljs.highlight(text, { language }).value;
  
  // Custom encoded inline JS snippet to handle copy actions uniformly securely online and offline
  const encodedText = encodeURIComponent(text).replace(/'/g, "%27");
  
  return `
<div class="code-block-wrapper" style="position: relative; margin: 1.5rem 0; background: #0d1117; border-radius: 8px; border: 1px solid #30363d; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background: #161b22; border-bottom: 1px solid #30363d; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #8b949e;">
    <span style="text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">${language}</span>
    <button onclick="
      var btn = this;
      navigator.clipboard.writeText(decodeURIComponent('${encodedText}')).then(function() {
        var originalHtml = btn.innerHTML;
        btn.innerHTML = '<svg width=\\'14\\' height=\\'14\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#10b981\\' stroke-width=\\'2\\'><path d=\\'M20 6 9 17l-5-5\\'/></svg> <span style=\\'color:#10b981\\'>Copied!</span>';
        setTimeout(function() { btn.innerHTML = originalHtml; }, 2000);
      })
    " style="background: none; border: none; color: #8b949e; cursor: pointer; display: flex; gap: 4px; align-items: center; transition: color 0.2s;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> <span>Copy</span>
    </button>
  </div>
  <pre style="margin: 0; padding: 16px; overflow-x: auto;"><code class="hljs language-${language}">${highlightedCode}</code></pre>
</div>
`;
};

marked.use({ renderer });

export default function MarkdownHtmlConverter({ faqs = [] }) {
  const [markdown, setMarkdown] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const fileInputRef = useRef(null);

  // Handle conversion of markdown text to HTML
  const handleConvert = () => {
    if (!markdown.trim()) return;
    const parsedHtml = marked.parse(markdown);
    setHtmlContent(parsedHtml);
  };

  // Handle uploading a markdown file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMarkdown(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  // Handle downloading the converted HTML to a file
  const handleDownload = () => {
    if (!htmlContent) return;
    const blob = new Blob([getHtmlTemplate(htmlContent)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-document.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open the HTML content in a new temporary browser tab
  const handleOpenTemp = () => {
    if (!htmlContent) return;
    const blob = new Blob([getHtmlTemplate(htmlContent)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // A basic HTML wrapper for the exported file so it renders nicely unstyled
  const getHtmlTemplate = (bodyContent) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Markdown</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
    h1, h2, h3, h4, h5, h6 { color: #111; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700; }
    code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; }
    pre { padding: 0; overflow-x: auto; background: transparent; border-radius: 0; }
    pre code { background: transparent; padding: 0; }
    .code-block-wrapper pre { background: transparent; }
    blockquote { border-left: 4px solid #e2e8f0; margin: 1em 0; padding-left: 1em; color: #64748b; font-style: italic; }
    a { color: #2563eb; text-decoration: underline; }
    ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 1rem; }
    ol { list-style-type: decimal; padding-left: 2rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
  };

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-border">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 mb-6 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border flex-shrink-0" />
            <Link
              href="/qa-tools"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              QA Tools
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border flex-shrink-0" />
            <span className="font-semibold text-foreground">Markdown → HTML</span>
          </nav>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
              ✦ Fast Parsing
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 px-3 py-1 rounded-full">
              Live Preview
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
              100% Client-Side
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400">Markdown to HTML</span>
            <span className="block text-foreground text-2xl sm:text-3xl font-bold mt-1">Converter</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Paste your Markdown text or upload a file. Convert it instantly to beautifully formatted HTML, ready for download or live preview directly within the browser.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Primary user actions */}
        <div className={styles.actions}>
          <label className={styles.fileInputLabel}>
            <Upload className="w-5 h-5" />
            Upload Markdown
            <input 
              type="file" 
              accept=".md,.txt" 
              onChange={handleFileUpload} 
              className={styles.fileInput}
              ref={fileInputRef}
            />
          </label>
          
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleConvert}>
            <Code className="w-5 h-5" />
            Convert to HTML
          </button>

          {htmlContent && (
            <>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleDownload}>
                <Download className="w-5 h-5" />
                Download HTML
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleOpenTemp}>
                <ExternalLink className="w-5 h-5" />
                View in Browser
              </button>
            </>
          )}
        </div>

        <div className={styles.workspace}>
          {/* Markdown Editor Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="w-4 h-4" />
                <span>Markdown Source</span>
              </div>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="# Title&#10;&#10;Write your markdown here or upload a file..."
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          {/* HTML Preview Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className="flex items-center gap-2 text-emerald-600">
                <Code className="w-4 h-4" />
                <span>HTML Preview</span>
              </div>
            </div>
            <div 
              className={styles.preview}
              dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color: #9ca3af; font-style: italic; margin-top: 2rem; text-align: center;">Click "Convert to HTML" to render your preview.</p>' }}
            />
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="mt-10">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              FAQ
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-blue-300 dark:data-[state=open]:border-blue-700 transition-colors"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground text-left hover:no-underline py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* ── Related tools ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 dark:from-blue-600/20 dark:via-violet-600/20 dark:to-blue-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-0.5">
              Need to process complex JSON data?
            </p>
            <p className="text-xs text-muted-foreground">
              Try our JSON to File Converter for seamless QA test data processing.
            </p>
          </div>
          <Link
            href="/qa-tools/json-to-file"
            prefetch={false}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline flex-shrink-0 shadow-sm shadow-blue-500/20"
          >
            <FileJson className="w-4 h-4" />
            JSON Converter
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
