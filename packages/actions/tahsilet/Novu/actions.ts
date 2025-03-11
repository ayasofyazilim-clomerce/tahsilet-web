"use server";
import {Novu} from "@novu/api";
const novu = new Novu({
  serverURL: process.env.NOVU_APP_URL,
  secretKey: process.env.NOVU_SECRET_KEY,
});
export async function triggerTahsiletNotification({
  score,
  subscriberId,
  email,
  phone,
}: {
  score: number;
  subscriberId: string;
  email: string;
  phone: string;
}) {
  try {
    const result = await novu.trigger({
      workflowId: "tahsilet-notification",
      payload: {
        score: score,
      },
      to: {
        subscriberId: subscriberId,
        phone: phone,
        email: email,
      },
    });

    return result;
  } catch (error) {
    return {
      result: {
        status: "error",
      },
    };
  }
}
