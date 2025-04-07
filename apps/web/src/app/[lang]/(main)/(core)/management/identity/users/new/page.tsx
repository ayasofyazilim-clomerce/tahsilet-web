"use server";

import {getAllRolesApi} from "@repo/actions/core/IdentityService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([]);

    const optionalRequests = await Promise.allSettled([getAllRolesApi(session)]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Create"],
    lang,
  });
  const apiRequests = await getApiRequests();

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {optionalRequests} = apiRequests;
  const [allRolesResponse] = optionalRequests;

  const allRoles = allRolesResponse.status === "fulfilled" ? allRolesResponse.value.data.items || [] : [];

  return (
    <>
      <Form languageData={languageData} roleList={allRoles} />
      <div className="hidden" id="page-description">
        {languageData["User.Create.Description"]}
      </div>
    </>
  );
}
