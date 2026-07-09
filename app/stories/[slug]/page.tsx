import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllStories, getFreeSlugs, getStoryBySlug } from "@/lib/stories";
import { hasActivePlan } from "@/lib/access";
import { isLoggedIn } from "@/lib/session";
import { formatDate } from "@/lib/format-date";
import StoryMarkdown from "@/app/components/StoryMarkdown";

export function generateStaticParams() {
  return getAllStories().map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const [loggedIn, subscriber] = await Promise.all([isLoggedIn(), hasActivePlan()]);
  const unlocked = getFreeSlugs().has(slug) || subscriber;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        &larr; All stories
      </Link>

      <div className="relative mt-6 h-64 w-full overflow-hidden rounded-lg bg-neutral-800 sm:h-80">
        <Image
          src={story.image}
          alt={story.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-6 text-sm uppercase tracking-wide text-amber-400">
        {story.region} &middot; {formatDate(story.date)} &middot; {story.readMinutes} min read
      </p>
      <h1 className="text-3xl font-bold mt-2 sm:text-4xl">{story.title}</h1>
      <p className="mt-4 text-lg text-neutral-400">{story.excerpt}</p>

      {unlocked ? (
        <article className="mt-8">
          <StoryMarkdown body={story.body} />
        </article>
      ) : (
        <div className="mt-8 rounded-lg border border-amber-800/60 bg-amber-950/40 p-6 text-center">
          <p className="font-medium text-neutral-100">
            This story is for members with an active plan.
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            New whiskey stories are published every week — subscribe to read
            this one and every past story.
          </p>
          <a
            href={
              loggedIn
                ? "/plans"
                : `/login?returnTo=${encodeURIComponent(`/stories/${slug}`)}`
            }
            className="mt-4 inline-block rounded-md bg-amber-600 px-5 py-2 text-white hover:bg-amber-500"
          >
            {loggedIn ? "See plans" : "Log in to subscribe"}
          </a>
        </div>
      )}
    </main>
  );
}
