"use server";

import type {GetApiLanguageManagementLanguageTextsData} from "@ayasofyazilim/core-saas/AdministrationService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getLanguagesApi,
  getLanguagesResourcesApi,
  getLanguageTextsApi,
} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/core/AdministrationService";
import LanguageTextsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiLanguageManagementLanguageTextsData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });
  const languageTextsResponse = await getLanguageTextsApi({
    ...searchParams,
    baseCultureName: searchParams.baseCultureName || "en",
    targetCultureName: searchParams.targetCultureName || "tr",
  });
  if (isErrorOnRequest(languageTextsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={languageTextsResponse.message} />;
  }
  const languagesResponse = await getLanguagesApi({
    maxResultCount: 300,
  });
  if (isErrorOnRequest(languagesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={languagesResponse.message} />;
  }
  const languagesResourcesResponse = await getLanguagesResourcesApi();
  if (isErrorOnRequest(languagesResourcesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={languagesResourcesResponse.message} />;
  }
  return (
    <LanguageTextsTable
      languageData={languageData}
      languageList={languagesResponse.data.items || []}
      languagesResourcesData={languagesResourcesResponse.data}
      response={languageTextsResponse.data}
    />
  );
}
