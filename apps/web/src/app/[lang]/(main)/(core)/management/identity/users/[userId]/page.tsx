"use server";

import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import {
  getAllRolesApi,
  getUserDetailsByIdApi,
  getUsersAssignableRolesApi,
} from "src/actions/core/TahsiletService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; userId: string}}) {
  const {lang, userId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Update"],
    lang,
  });

  const userDetailsResponse = await getUserDetailsByIdApi(userId);
  if (isErrorOnRequest(userDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userDetailsResponse.message} />;
  }

  const rolesResponse = await getAllRolesApi();
  if (isErrorOnRequest(rolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={rolesResponse.message} />;
  }

  const userRolesResponse = await getUsersAssignableRolesApi(userId);
  if (isErrorOnRequest(userRolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userRolesResponse.message} />;
  }

  return (
    <>
      <Form
        languageData={languageData}
        roleList={rolesResponse.data.items || []}
        userDetailsData={userDetailsResponse.data}
        userRoles={userRolesResponse.data.items || []}
      />
      <div className="hidden" id="page-title">
        {`${languageData.User} (${userDetailsResponse.data.userName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["User.Update.Description"]}
      </div>
    </>
  );
}
