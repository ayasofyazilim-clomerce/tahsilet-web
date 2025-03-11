"use server";

import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {isUnauthorized} from "@repo/utils/policies";
import {getMemberApi} from "@repo/actions/tahsilet/TahsiletService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; memberId: string}}) {
  const {lang, memberId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Create"],
    lang,
  });

  const memberDetailsResponse = await getMemberApi({
    id: memberId,
  });
  if (isErrorOnRequest(memberDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={memberDetailsResponse.message} />;
  }

  return (
    <Form languageData={languageData} memberDetailsData={memberDetailsResponse.data.items || []} memberId={memberId} />
  );
}
