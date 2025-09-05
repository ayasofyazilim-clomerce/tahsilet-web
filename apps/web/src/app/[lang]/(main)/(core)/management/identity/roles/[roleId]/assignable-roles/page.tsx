"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAssignableRolesApi, getRoleDetailsByIdApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; roleId: string}}) {
  const {lang, roleId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });

  const assignableRolesResponse = await getAssignableRolesApi(roleId);
  if (isErrorOnRequest(assignableRolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={assignableRolesResponse.message} />;
  }

  const roleDetailsResponse = await getRoleDetailsByIdApi(roleId);
  if (isErrorOnRequest(roleDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={roleDetailsResponse.message} />;
  }

  return (
    <>
      <Form assignableRoleList={assignableRolesResponse.data} languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.Role} (${roleDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Role.Assignable.Description"]}
      </div>
    </>
  );
}
