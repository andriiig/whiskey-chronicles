import { cookies } from "next/headers";
import type { Tokens } from "@wix/sdk";

const TOKENS_COOKIE = "wix_tokens";
const OAUTH_DATA_COOKIE = "wix_oauth_data";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function getStoredTokens(): Promise<Tokens | undefined> {
  const raw = (await cookies()).get(TOKENS_COOKIE)?.value;
  return raw ? (JSON.parse(raw) as Tokens) : undefined;
}

export async function storeTokens(tokens: Tokens) {
  (await cookies()).set(TOKENS_COOKIE, JSON.stringify(tokens), COOKIE_OPTS);
}

export async function clearTokens() {
  (await cookies()).delete(TOKENS_COOKIE);
}

export async function storeOAuthData(oauthData: unknown) {
  (await cookies()).set(OAUTH_DATA_COOKIE, JSON.stringify(oauthData), {
    ...COOKIE_OPTS,
    maxAge: 60 * 10,
  });
}

export async function popOAuthData<T>(): Promise<T | undefined> {
  const store = await cookies();
  const raw = store.get(OAUTH_DATA_COOKIE)?.value;
  store.delete(OAUTH_DATA_COOKIE);
  return raw ? (JSON.parse(raw) as T) : undefined;
}

export async function isLoggedIn(): Promise<boolean> {
  const tokens = await getStoredTokens();
  return Boolean(tokens?.accessToken?.value);
}
