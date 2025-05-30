"use server";

import {getMemberApi} from "@repo/actions/tahsilet/TahsiletService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

async function getApiRequests({memberId}: {memberId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getMemberApi(
        {
          id: memberId,
        },
        session,
      ),
    ]);

    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({params}: {params: {lang: string; memberId: string}}) {
  const {lang, memberId} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({memberId});
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} signOutServer={signOutServer} />;
  }
  const [member] = apiRequests.requiredRequests;

  return <Form languageData={languageData} memberDetailsData={member.data.items || []} memberId={memberId} />;
}
