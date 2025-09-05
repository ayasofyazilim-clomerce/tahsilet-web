"use server";

import type {GetApiTextTemplateManagementTemplateDefinitionsData} from "@ayasofyazilim/core-saas/AdministrationService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTextTemplateApi} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/core/AdministrationService";
import TextTemplateTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiTextTemplateManagementTemplateDefinitionsData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });
  const textTemplateResponse = await getTextTemplateApi(searchParams);

  if (isErrorOnRequest(textTemplateResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={textTemplateResponse.message} />;
  }

  return <TextTemplateTable languageData={languageData} response={textTemplateResponse.data} />;
}
