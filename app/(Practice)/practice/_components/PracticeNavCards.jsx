import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { practiceNavElements } from "@/data/practiceElements";

/**
 * Previous / Next element navigation for practice pages.
 * Rendered as a server component — no "use client" needed.
 *
 * Props:
 *   currentSlug — the slug of the current practice page (e.g. "buttons")
 *
 * To extend: just keep practiceNavElements in data/practiceElements.js up to date.
 * Order in that array = order of prev/next.
 */
const PracticeNavCards = ({ currentSlug }) => {
  const idx = practiceNavElements.findIndex((el) => el.slug === currentSlug);

  // Not found in the list — render nothing
  if (idx === -1) return null;

  const prev = idx > 0 ? practiceNavElements[idx - 1] : null;
  const next = idx < practiceNavElements.length - 1 ? practiceNavElements[idx + 1] : null;

  // Nothing on either side (shouldn't happen but guard anyway)
  if (!prev && !next) return null;

  return (
    <section aria-label="Navigate to other practice elements" className="max-w-3xl mx-auto mt-6 mb-12 px-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
        More elements to practice
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous */}
        {prev ? (
          <NavCard el={prev} direction="prev" />
        ) : (
          /* Empty spacer so Next card always sits on the right */
          <div className="hidden sm:block" />
        )}

        {/* Next */}
        {next && <NavCard el={next} direction="next" />}
      </div>
    </section>
  );
};

/* ─── Individual card ─────────────────────────────────────────── */

function NavCard({ el, direction }) {
  const isPrev = direction === "prev";

  return (
    <Link
      href={`/practice/${el.slug}`}
      prefetch={false}
      aria-label={`${isPrev ? "Previous" : "Next"} element: ${el.title}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
        <Image
          src={el.logo}
          width={26}
          height={26}
          alt=""
          aria-hidden="true"
          className="opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground mb-0.5 flex items-center gap-1 leading-none">
          {isPrev ? (
            <><ArrowLeft size={11} className="flex-shrink-0" /> Previous</>
          ) : (
            <>Next <ArrowRight size={11} className="flex-shrink-0" /></>
          )}
        </p>
        <p className="text-sm font-semibold text-foreground truncate leading-snug mt-1">
          {el.title}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5 leading-snug hidden sm:block">
          {el.description}
        </p>
      </div>
    </Link>
  );
}

export default PracticeNavCards;
