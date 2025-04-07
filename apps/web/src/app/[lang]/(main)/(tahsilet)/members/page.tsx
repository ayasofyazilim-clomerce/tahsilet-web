"use server";

import type {GetApiMemberData} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {getMemberApi} from "@repo/actions/tahsilet/TahsiletService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/core/IdentityService";
import MembersTable from "./_components/table";

async function getApiRequests({searchParams}: {searchParams: GetApiMemberData}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getMemberApi(
        {
          ...searchParams,
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

export default async function Page({params, searchParams}: {params: {lang: string}; searchParams: GetApiMemberData}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests({searchParams});
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} signOutServer={signOutServer} />;
  }
  const [member] = apiRequests.requiredRequests;

  return <MembersTable languageData={languageData} response={member.data} />;
}
