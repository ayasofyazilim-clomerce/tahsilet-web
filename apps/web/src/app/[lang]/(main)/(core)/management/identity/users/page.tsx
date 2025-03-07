"use server";

import type {GetApiIdentityUsersData} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import {getUsersApi} from "src/actions/core/TahsiletService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import UsersTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiIdentityUsersData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users"],
    lang,
  });

  const usersResponse = await getUsersApi(searchParams);
  if (isErrorOnRequest(usersResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={usersResponse.message} />;
  }

  return <UsersTable languageData={languageData} response={usersResponse.data} />;
}
