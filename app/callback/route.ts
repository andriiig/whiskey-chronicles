import { NextRequest, NextResponse } from "next/server";
import { getWixClient } from "@/lib/wix-client";
import { popOAuthData, storeTokens } from "@/lib/session";

/**
 * Completes the Wix Headless OAuth flow: exchanges the auth code for
 * member tokens and stores them, then redirects back to where the
 * visitor started.
 */
export async function GET(request: NextRequest) {
  const oauthData = await popOAuthData<Parameters<
    ReturnType<typeof getWixClient>["auth"]["getMemberTokens"]
  >[2]>();

  if (!oauthData) {
    return NextResponse.redirect(new URL("/?error=oauth_expired", request.url));
  }

  const client = getWixClient();
  const { code, state } = client.auth.parseFromUrl(request.url);
  const tokens = await client.auth.getMemberTokens(code, state, oauthData);
  await storeTokens(tokens);

  return NextResponse.redirect(new URL(oauthData.originalUri || "/", request.url));
}
