"use server";

import type {GetApiMultiTenancyTenantsData} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import {getTenantsApi} from "src/actions/core/TahsiletService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/SaasService";
import TenantsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiMultiTenancyTenantsData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpTenantManagement.Tenants"],
    lang,
  });
  const tenantsResponse = await getTenantsApi(searchParams);
  if (isErrorOnRequest(tenantsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tenantsResponse.message} />;
  }

  return <TenantsTable languageData={languageData} response={tenantsResponse.data} />;
}
