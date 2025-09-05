"use server";

import type {GetApiSaasEditionsData} from "@ayasofyazilim/core-saas/SaasService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getEditionsApi} from "@repo/actions/core/SaasService/actions";
import {getResourceData} from "src/language-data/core/SaasService";
import EditionsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiSaasEditionsData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });
  const editionsResponse = await getEditionsApi(searchParams);
  if (isErrorOnRequest(editionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={editionsResponse.message} />;
  }

  return <EditionsTable languageData={languageData} response={editionsResponse.data} />;
}
