"use server";
import {Novu} from "@novu/api";
const novu = new Novu({
  serverURL: process.env.NOVU_APP_URL,
  secretKey: process.env.NOVU_SECRET_KEY,
});
export async function triggerTahsiletSendScore({
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
    const payload = {
      workflowId: "tahsilet-send-score",
      payload: {
        score: score,
      },
      to: {
        subscriberId: subscriberId,
        phone: phone,
        email: email,
      },
    };
    const result = await novu.trigger(payload);
    return result;
  } catch (error) {
    return {
      result: {
        status: "error",
      },
    };
  }
}

export async function triggerTahsiletRemindPayment({
  sender,
  subject,
  subscriberId,
  email,
  phone,
}: {
  sender: string;
  subject: string;
  subscriberId: string;
  email: string;
  phone: string;
}) {
  try {
    const payload = {
      workflowId: "tahsilet-remind-payment",
      payload: {
        subject,
        sender,
      },
      to: {
        subscriberId: subscriberId,
        phone: phone,
        email: email,
      },
    };
    const result = await novu.trigger(payload);
    return result;
  } catch (error) {
    return {
      result: {
        status: "error",
      },
    };
  }
}
