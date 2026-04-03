import { Pencil } from "lucide-react";
import { TYPE_COLORS, TYPE_LABELS } from "./resource-constant";
import { Trash2 } from "lucide-react";
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
import { ExternalLink } from "lucide-react";

export default function ResourceCard({ r, onEdit, onDelete, onFilterByTag }) {
  const visibleTags = r.tags.slice(0, 3);
  const hiddenCount = r.tags.length - 3;

  return (
    <div
      className="bg-white border border-[#e9eaed] rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow"
      data-testid={`resource-card-${r.id}`}
    >
      {/* Image — fixed 120px, placeholder if no image URL */}
      <div
        className="h-[120px]  flex-shrink-0 overflow-hidden"
        style={{
          background: r.image
            ? undefined
            : (TYPE_COLORS[r.resourceType]?.bg ?? "#f3f4f6"),
        }}
      >
        {r.image ? (
          <img
            src={r.image}
            alt={r.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-[1.5rem] font-bold tracking-wide select-none opacity-30"
              style={{ color: TYPE_COLORS[r.resourceType]?.color }}
            >
              {TYPE_LABELS[r.resourceType]}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Type badge + action buttons */}
        <div className="flex items-center justify-between gap-1">
          <span
            className="inline-flex items-center px-[9px] py-[3px] rounded-full text-[0.72rem] font-semibold whitespace-nowrap"
            style={TYPE_COLORS[r.resourceType]}
          >
            {TYPE_LABELS[r.resourceType]}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-transparent border-none cursor-pointer text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              onClick={() => onEdit(r)}
              title="Edit"
              data-testid={`edit-card-${r.id}`}
            >
              <Pencil size={13} />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-transparent border-none cursor-pointer text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Delete"
                  data-testid={`delete-card-${r.id}`}
                >
                  <Trash2 size={13} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete resource?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &ldquo;{r.title}&rdquo; will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(r.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Title — 2-line clamp with external link icon */}
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-start gap-1 font-semibold text-[#1f2937] no-underline hover:text-blue-600 hover:underline text-sm leading-snug transition-colors overflow-hidden"
          style={{ minHeight: "2.5rem" }}
          data-testid={`card-title-${r.id}`}
        >
          <span className="line-clamp-2">{r.title}</span>
          <ExternalLink size={11} className="flex-shrink-0 mt-[2px]" />
        </a>

        {/* Description — 2-line clamp, hidden if empty */}
        {r.description && (
          <p className="text-[0.77rem] text-gray-500 line-clamp-2 m-0">
            {r.description}
          </p>
        )}

        {/* Tags — max 3 visible, "+N" badge for rest */}
        {r.tags.length > 0 && (
          <div
            className="flex flex-wrap gap-1 overflow-hidden"
            style={{ maxHeight: "1.8rem" }}
          >
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-600 text-[0.72rem] px-[7px] py-[2px] rounded-full cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap"
                onClick={() => onFilterByTag(tag)}
                title={`Filter by "${tag}"`}
              >
                {tag}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="inline-block bg-gray-200 text-gray-500 text-[0.72rem] px-[7px] py-[2px] rounded-full whitespace-nowrap">
                +{hiddenCount}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <p className="text-[0.72rem] text-gray-400 mt-auto pt-1 m-0">
          {new Date(r.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
