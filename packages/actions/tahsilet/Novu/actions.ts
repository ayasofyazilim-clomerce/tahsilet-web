"use server";
import { Novu } from "@novu/api";
const novu = new Novu({
  serverURL: process.env.NOVU_APP_URL,
  secretKey: process.env.NOVU_SECRET_KEY,
});
export async function triggerTahsiletSendScore({
  score,
  memberName,
  subscriberId,
  email,
  phone,
}: {
  score: number;
  memberName: string;
  subscriberId: string;
  email: string;
  phone: string;
}) {
  try {
    const payload = {
      workflowId: "tahsilet-risk-score",
      payload: {
        score: score,
        memberName: memberName,
        subject: "Risk skorunuz",
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
  memberName,
  subscriberId,
  email,
  phone,
}: {
  sender: string;
  subject: string;
  memberName: string;
  subscriberId: string;
  email: string;
  phone: string;
}) {
  try {
    const payload = {
      workflowId: "tahsilet-remind-payment",
      payload: {
        subject,
        memberName,
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
