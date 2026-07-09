interface PlanPricing {
  price?: { value?: string; currency?: string };
  subscription?: { cycleDuration?: { count?: number | null; unit?: string } };
  singlePaymentForDuration?: { count?: number | null; unit?: string };
  singlePaymentUnlimited?: boolean | null;
}

const UNIT_LABEL: Record<string, string> = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

/** Renders a plan's price as e.g. "$5.00 / month", "$50.00 / year", or "$50.00 one-time". */
export function formatPlanPrice(pricing?: PlanPricing): string {
  if (!pricing?.price?.value) return "";

  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: pricing.price.currency || "USD",
  }).format(Number(pricing.price.value));

  const duration = pricing.subscription?.cycleDuration ?? pricing.singlePaymentForDuration;
  if (duration?.unit) {
    const count = duration.count ?? 1;
    const unit = UNIT_LABEL[duration.unit] ?? duration.unit.toLowerCase();
    return count > 1 ? `${amount} / ${count} ${unit}s` : `${amount} / ${unit}`;
  }

  return `${amount} one-time`;
}
