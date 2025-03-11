"use server";
import {TAHSILETServiceClient} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import type {Session} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";

const HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
};

export async function getTahsiletServiceClient(session?: Session | null) {
  const userData = session || (await auth());
  const token = userData?.user?.access_token;
  return new TAHSILETServiceClient({
    TOKEN: token,
    BASE: process.env.BASE_URL,
    HEADERS,
  });
}
