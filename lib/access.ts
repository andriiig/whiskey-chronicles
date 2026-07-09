import { getWixClient } from "./wix-client";
import { getStoredTokens } from "./session";

/**
 * Whether the current visitor is a logged-in member with at least one
 * active (or free-trial) pricing plan order. This is the single gate
 * every story page checks before rendering paid content.
 */
export async function hasActivePlan(): Promise<boolean> {
  const tokens = await getStoredTokens();
  if (!tokens?.accessToken?.value) return false;

  const client = getWixClient(tokens);
  const { orders: memberOrders } = await client.orders.memberListOrders({
    orderStatuses: ["ACTIVE"],
  });

  return Boolean(memberOrders?.length);
}
