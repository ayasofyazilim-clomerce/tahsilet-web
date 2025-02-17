"use server";

import type {GetApiMemberData} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import {getMemberApi} from "src/actions/core/TahsiletService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import MembersTable from "./_components/table";

export default async function Page({params, searchParams}: {params: {lang: string}; searchParams: GetApiMemberData}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TahsilEt.Members"],
    lang,
  });

  const membersResponse = await getMemberApi(searchParams);
  if (isErrorOnRequest(membersResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={membersResponse.message} />;
  }

  return <MembersTable languageData={languageData} response={membersResponse.data} />;
}
