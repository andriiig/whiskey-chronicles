import Link from "next/link";
import { getWixClient } from "@/lib/wix-client";
import { getStoredTokens, isLoggedIn } from "@/lib/session";
import { formatPlanPrice } from "@/lib/format-price";

export default async function PlansPage() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    return (
      <main className="max-w-xl mx-auto px-6 py-16 text-center">
        <p>Log in first to see subscription plans.</p>
        <a
          href="/login?returnTo=/plans"
          className="mt-4 inline-block rounded-md bg-amber-600 px-5 py-2 text-white hover:bg-amber-500"
        >
          Log in
        </a>
      </main>
    );
  }

  const client = getWixClient(await getStoredTokens());
  const { plans } = await client.plans.listPublicPlans();
  const sortedPlans = [...(plans ?? [])].sort(
    (a, b) => Number(a.pricing?.price?.value ?? 0) - Number(b.pricing?.price?.value ?? 0)
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        &larr; All stories
      </Link>
      <h1 className="text-3xl font-bold mt-6">Subscribe to Whiskey Chronicles</h1>
      <p className="mt-2 text-neutral-400">
        One new whiskey history story every week, unlocked for members only.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sortedPlans.map((plan, index) => {
          const isBestValue = sortedPlans.length > 1 && index === sortedPlans.length - 1;
          return (
            <form key={plan._id} action="/api/checkout" method="POST">
              <input type="hidden" name="planId" value={plan._id} />
              <div
                className={`relative rounded-lg border p-6 h-full flex flex-col ${
                  isBestValue
                    ? "border-amber-600 bg-amber-950/30"
                    : "border-neutral-800 bg-neutral-900"
                }`}
              >
                {isBestValue && (
                  <span className="absolute -top-3 right-6 rounded-full bg-amber-600 px-3 py-1 text-xs font-medium text-white">
                    Best value
                  </span>
                )}
                <h2 className="text-xl font-semibold text-neutral-100">{plan.name}</h2>
                <p className="mt-1 text-2xl font-bold text-amber-400">
                  {formatPlanPrice(plan.pricing)}
                </p>
                <p className="mt-2 text-sm text-neutral-400 flex-1">
                  {plan.description}
                </p>
                <button
                  type="submit"
                  className="mt-4 rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </main>
  );
}
