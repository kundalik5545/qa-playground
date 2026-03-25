"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, Calendar, ChevronDown } from "lucide-react";

const TAG_COLORS = {
  automation:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700",
  testing:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700",
  selenium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700",
  playwright:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-700",
  tools:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border border-teal-200 dark:border-teal-700",
  nextjs:
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600",
  general:
    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
};
const TAG_FALLBACK =
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700";

const POSTS_PER_PAGE = 6;

// Number of posts shown in the secondary horizontal grid below the featured card.
// Change this value to control both the post count and the column count.
const SECONDARY_GRID_POSTS = 3;

// Tailwind grid-cols classes keyed by SECONDARY_GRID_POSTS value.
// Full strings required so Tailwind includes them in the build.
const SECONDARY_GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

function TagPill({ tag, onTagClick }) {
  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onTagClick(tag);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTagClick(tag);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Filter by ${tag}`}
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize cursor-pointer hover:opacity-75 transition-opacity ${
        TAG_COLORS[tag] || TAG_FALLBACK
      }`}
    >
      {tag}
    </span>
  );
}

function FeaturedCard({ post, onTagClick }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className="group block"
      aria-label={`Read more about ${post.title}`}
    >
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Image */}
        <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto md:min-h-[280px] flex-shrink-0">
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            priority
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
            Featured
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-6 md:p-8 gap-4 flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(post.category || []).map((cat) => (
              <TagPill key={cat} tag={cat} onTagClick={onTagClick} />
            ))}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 flex-wrap border-t border-gray-100 dark:border-gray-800 pt-3">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} min read
            </span>
            <span>By {post.author || "Kundalik Jadhav"}</span>
          </div>

          <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:underline self-start">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post, onTagClick }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className="group block h-full"
      aria-label={`Read more about ${post.title}`}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Image — 16:9 */}
        <div className="relative w-full aspect-video flex-shrink-0">
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col flex-grow p-5 gap-3">
          {/* Tags — above title */}
          <div className="flex flex-wrap gap-1.5">
            {(post.category || []).map((cat) => (
              <TagPill key={cat} tag={cat} onTagClick={onTagClick} />
            ))}
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug min-h-[3rem]">
            {post.title}
          </h2>

          {/* Excerpt — CSS line clamp */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 flex-grow">
            {post.description}
          </p>

          {/* Meta — bottom */}
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 flex-wrap pt-2 border-t border-gray-100 dark:border-gray-800 mt-auto">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readingTime} min read
            </span>
          </div>

          {/* Read more — text link */}
          <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogClientContent({ posts }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach((p) => (p.category || []).forEach((c) => tags.add(c)));
    return Array.from(tags).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (activeTag !== "all") {
      result = result.filter((p) => (p.category || []).includes(activeTag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q),
      );
    }
    if (sortOrder === "oldest") {
      result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return result;
  }, [posts, activeTag, search, sortOrder]);

  const visible = filtered.slice(0, visibleCount);
  const [featured, ...allRest] = visible;
  const rest = allRest.slice(0, SECONDARY_GRID_POSTS);
  const hasMore = visibleCount < filtered.length;

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setVisibleCount(POSTS_PER_PAGE);
  };

  return (
    <div>
      {/* ── Search + Filter + Sort ─────────────────────────────── */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(POSTS_PER_PAGE);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-600"
          />
        </div>

        {/* Tag pills + Sort */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Filter by category"
          >
            <button
              onClick={() => handleTagClick("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors min-h-[32px] ${
                activeTag === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              role="listitem"
              aria-pressed={activeTag === "all"}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all min-h-[32px] ${
                  activeTag === tag
                    ? "ring-2 ring-offset-1 ring-current opacity-100"
                    : "hover:opacity-75"
                } ${TAG_COLORS[tag] || TAG_FALLBACK}`}
                role="listitem"
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-h-[32px]"
              aria-label="Sort posts"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ── Post count ─────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
        Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}{" "}
        {filtered.length === 1 ? "post" : "posts"}
      </p>

      {/* ── No results ─────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="text-lg font-semibold mb-2">No posts found</p>
          <p className="text-sm">Try a different search term or category.</p>
        </div>
      )}

      {/* ── Featured post ──────────────────────────────────────── */}
      {featured && (
        <div className="mb-8">
          <FeaturedCard post={featured} onTagClick={handleTagClick} />
        </div>
      )}

      {/* ── Secondary grid ─────────────────────────────────────── */}
      {rest.length > 0 && (
        <ul
          className={`grid ${SECONDARY_GRID_COLS[SECONDARY_GRID_POSTS] ?? SECONDARY_GRID_COLS[2]} gap-6 mb-8 list-none p-0 m-0`}
          role="list"
        >
          {rest.map((post) => (
            <li key={post.slug} className="flex" role="listitem">
              <PostCard post={post} onTagClick={handleTagClick} />
            </li>
          ))}
        </ul>
      )}

      {/* ── Load More ──────────────────────────────────────────── */}
      {hasMore && (
        <div className="text-center mt-6 mb-4">
          <button
            onClick={() => setVisibleCount((v) => v + POSTS_PER_PAGE)}
            className="px-7 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}
