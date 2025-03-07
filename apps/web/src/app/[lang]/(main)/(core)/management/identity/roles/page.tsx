"use server";

import type {GetApiIdentityRolesData} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import RolesTable from "./_components/table";
import {isUnauthorized} from "@repo/utils/policies";
import {getRolesApi} from "@/actions/core/TahsiletService/actions";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiIdentityRolesData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });

  const rolesResponse = await getRolesApi(searchParams);
  if (isErrorOnRequest(rolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={rolesResponse.message} />;
  }

  return <RolesTable languageData={languageData} response={rolesResponse.data} />;
}
