import { NextRequest, NextResponse } from "next/server";
import { getWixClient } from "@/lib/wix-client";
import { storeOAuthData } from "@/lib/session";

/**
 * Starts the Wix Headless OAuth flow: generates PKCE state, stashes it
 * in a short-lived cookie, then redirects the browser to Wix's login page.
 */
export async function GET(request: NextRequest) {
  const client = getWixClient();
  const redirectUri = new URL("/callback", request.url).toString();
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? "/";

  const oauthData = client.auth.generateOAuthData(redirectUri, returnTo);
  await storeOAuthData(oauthData);

  const { authUrl } = await client.auth.getAuthUrl(oauthData);
  return NextResponse.redirect(authUrl);
}
