"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format-date";

export interface BrowserStory {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  region: string;
  image: string;
  readMinutes: number;
  unlocked: boolean;
}

export default function StoryBrowser({ stories }: { stories: BrowserStory[] }) {
  const regions = useMemo(
    () => ["All", ...Array.from(new Set(stories.map((s) => s.region)))],
    [stories]
  );
  const [region, setRegion] = useState("All");

  const visible =
    region === "All" ? stories : stories.filter((s) => s.region === region);

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-2">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`rounded-full px-3 py-1 text-sm border transition-colors cursor-pointer ${
              region === r
                ? "bg-amber-600 text-white border-amber-600"
                : "border-neutral-700 text-neutral-400 hover:border-amber-500 hover:text-amber-400"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((story) => (
          <li key={story.slug}>
            <Link
              href={`/stories/${story.slug}`}
              className="group block overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition-shadow hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden bg-neutral-800">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {!story.unlocked && (
                  <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                    &#128274; Members
                  </span>
                )}
                {story.unlocked && (
                  <span className="absolute top-2 right-2 rounded-full bg-emerald-700/90 px-2 py-1 text-xs text-white">
                    Free
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-amber-400">
                  {story.region} &middot; {formatDate(story.date)} &middot; {story.readMinutes} min
                </p>
                <h2 className="mt-1 font-semibold text-neutral-100 group-hover:underline">
                  {story.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">{story.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="mt-8 text-center text-neutral-400">
          No stories from that region yet.
        </p>
      )}
    </div>
  );
}
