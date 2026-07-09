import { getAllStories, getFreeSlugs } from "@/lib/stories";
import { hasActivePlan } from "@/lib/access";
import { isLoggedIn } from "@/lib/session";
import StoryBrowser from "@/app/components/StoryBrowser";

export default async function Home() {
  const stories = getAllStories();
  const freeSlugs = getFreeSlugs();
  const [loggedIn, subscriber] = await Promise.all([isLoggedIn(), hasActivePlan()]);

  const browserStories = stories.map((story) => ({
    ...story,
    unlocked: freeSlugs.has(story.slug) || subscriber,
  }));

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">Whiskey Chronicles</h1>
          <p className="mt-2 text-neutral-400">
            A new whiskey history story, every week. The first {freeSlugs.size}{" "}
            stories are free for everyone — the rest are for subscribers.
          </p>
        </div>
        {loggedIn ? (
          <a href="/logout" className="text-sm text-amber-400 hover:underline whitespace-nowrap">
            Log out
          </a>
        ) : (
          <a href="/login" className="text-sm text-amber-400 hover:underline whitespace-nowrap">
            Log in
          </a>
        )}
      </header>

      {!subscriber && (
        <div className="mt-6 rounded-lg border border-amber-800/60 bg-amber-950/40 p-4 text-sm text-neutral-200">
          Unlock every past and future story with a subscription.{" "}
          <a href={loggedIn ? "/plans" : "/login?returnTo=/plans"} className="font-medium text-amber-400 underline">
            {loggedIn ? "See plans" : "Log in to subscribe"}
          </a>
          .
        </div>
      )}

      <StoryBrowser stories={browserStories} />
    </main>
  );
}
