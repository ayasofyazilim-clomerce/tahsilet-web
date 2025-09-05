"use server";

import type {GetApiLanguageManagementLanguagesData} from "@ayasofyazilim/core-saas/AdministrationService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getLanguagesApi} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/core/AdministrationService";
import LanguagesTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiLanguageManagementLanguagesData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });
  const languagesResponse = await getLanguagesApi(searchParams);
  if (isErrorOnRequest(languagesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={languagesResponse.message} />;
  }

  return <LanguagesTable languageData={languageData} response={languagesResponse.data} />;
}
