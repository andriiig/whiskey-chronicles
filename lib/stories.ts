import fs from "fs";
import path from "path";
import matter from "gray-matter";

const STORIES_DIR = path.join(process.cwd(), "content", "stories");

/** The oldest N stories (by publish date) are free for everyone; the rest require an active plan. */
export const FREE_STORY_COUNT = 5;

export interface StoryMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  region: string;
  image: string;
  readMinutes: number;
}

export interface Story extends StoryMeta {
  body: string;
}

const WORDS_PER_MINUTE = 200;

function estimateReadMinutes(body: string): number {
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

function readStoryFile(filename: string): Story {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(STORIES_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    region: data.region,
    image: data.image,
    body: content,
    readMinutes: estimateReadMinutes(content),
  };
}

function readAllStoryFiles(): Story[] {
  return fs
    .readdirSync(STORIES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readStoryFile);
}

export function getAllStories(): StoryMeta[] {
  return readAllStoryFiles().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getStoryBySlug(slug: string): Story | undefined {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(STORIES_DIR, filename))) return undefined;
  return readStoryFile(filename);
}

/** Slugs of the earliest FREE_STORY_COUNT stories — open to every visitor, no plan required. */
export function getFreeSlugs(): Set<string> {
  const oldestFirst = readAllStoryFiles().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return new Set(oldestFirst.slice(0, FREE_STORY_COUNT).map((s) => s.slug));
}
