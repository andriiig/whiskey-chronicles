import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";
import { members } from "@wix/members";
import { orders, plans } from "@wix/pricing-plans";
import { redirects } from "@wix/redirects";

const CLIENT_ID = process.env.WIX_CLIENT_ID;

if (!CLIENT_ID) {
  throw new Error(
    "WIX_CLIENT_ID is not set. Create a Wix Headless OAuth app and copy its Client ID into .env.local."
  );
}

/**
 * Build a Wix SDK client bound to the given tokens (or an anonymous
 * visitor session if no tokens are provided). One client per request —
 * never share a client across requests, since it holds a specific
 * member's/visitor's tokens.
 */
export function getWixClient(tokens?: Tokens) {
  return createClient({
    modules: { members, orders, plans, redirects },
    auth: OAuthStrategy({ clientId: CLIENT_ID!, tokens }),
  });
}
