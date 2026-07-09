import { NextRequest, NextResponse } from "next/server";
import { getWixClient } from "@/lib/wix-client";
import { getStoredTokens } from "@/lib/session";

/**
 * Creates a Wix-hosted Pricing Plans checkout session for the chosen plan
 * and redirects the browser there. Wix handles payment collection; on
 * completion it redirects back to `postFlowUrl`.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const planId = formData.get("planId");
  if (typeof planId !== "string" || !planId) {
    return NextResponse.redirect(new URL("/plans", request.url));
  }

  const client = getWixClient(await getStoredTokens());
  const { redirectSession } = await client.redirects.createRedirectSession({
    paidPlansCheckout: { planId },
    callbacks: { postFlowUrl: new URL("/", request.url).toString() },
  });

  if (!redirectSession?.fullUrl) {
    return NextResponse.redirect(new URL("/plans?error=checkout_failed", request.url));
  }

  return NextResponse.redirect(redirectSession.fullUrl);
}
