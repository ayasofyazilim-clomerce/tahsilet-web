"use server";

import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getFeaturesApi} from "@repo/actions/core/AdministrationService/actions";
import {getTenantDetailsByIdApi} from "@repo/actions/core/SaasService/actions";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; tenantId: string}}) {
  const {lang, tenantId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });

  const tenantDetailsDataResponse = await getTenantDetailsByIdApi(tenantId);
  if (isErrorOnRequest(tenantDetailsDataResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tenantDetailsDataResponse.message} />;
  }

  const featuresResponse = await getFeaturesApi({
    providerName: "T",
    providerKey: tenantId,
  });
  if (isErrorOnRequest(featuresResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={featuresResponse.message} />;
  }

  return (
    <>
      <Form featuresData={featuresResponse.data} languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.Tenant} (${tenantDetailsDataResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Tenant.Features.Description"]}
      </div>
    </>
  );
}
