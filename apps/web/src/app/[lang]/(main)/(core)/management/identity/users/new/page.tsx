"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {getAllRolesApi} from "src/actions/core/TahsiletService/actions";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Create"],
    lang,
  });

  const rolesResponse = await getAllRolesApi();
  if (isErrorOnRequest(rolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={rolesResponse.message} />;
  }

  return (
    <>
      <Form languageData={languageData} roleList={rolesResponse.data.items || []} />
      <div className="hidden" id="page-description">
        {languageData["User.Create.Description"]}
      </div>
    </>
  );
}
