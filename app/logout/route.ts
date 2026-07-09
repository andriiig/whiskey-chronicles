import { NextRequest, NextResponse } from "next/server";
import { getWixClient } from "@/lib/wix-client";
import { clearTokens, getStoredTokens } from "@/lib/session";

export async function GET(request: NextRequest) {
  const tokens = await getStoredTokens();
  await clearTokens();

  if (!tokens) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const client = getWixClient(tokens);
  const { logoutUrl } = await client.auth.logout(new URL("/", request.url).toString());
  return NextResponse.redirect(logoutUrl);
}
