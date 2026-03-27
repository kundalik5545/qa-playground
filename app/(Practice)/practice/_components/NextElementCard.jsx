import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { practiceNavElements } from "@/data/practiceElements";

/**
 * "Up Next" sidebar card — rendered below the "What You'll Learn" card.
 * Shows the next element in the practice sequence with a descriptive,
 * keyword-rich anchor link (dofollow) for SEO internal linking.
 *
 * Props:
 *   currentSlug — e.g. "buttons". Matches keys in practiceNavElements.
 *
 * To maintain: only update data/practiceElements.js.
 * No changes needed here when adding new elements.
 */
export default function NextElementCard({ currentSlug }) {
  const idx = practiceNavElements.findIndex((el) => el.slug === currentSlug);
  const next = idx !== -1 && idx < practiceNavElements.length - 1
    ? practiceNavElements[idx + 1]
    : null;

  if (!next) return null;

  return (
    <div className="mt-3">
      {/* Label */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-0.5">
        Up Next
      </p>

      <Link
        href={`/practice/${next.slug}`}
        prefetch={false}
        aria-label={`Practice ${next.title} automation — next element`}
        className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 w-full"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
          <Image
            src={next.logo}
            width={20}
            height={20}
            alt=""
            aria-hidden="true"
            className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate leading-snug">
            {next.title}
          </p>
          <p className="text-[11px] text-muted-foreground truncate leading-snug mt-0.5">
            {next.description}
          </p>
        </div>

        {/* Arrow */}
        <ArrowRight
          size={14}
          className="flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
        />
      </Link>
    </div>
  );
}
