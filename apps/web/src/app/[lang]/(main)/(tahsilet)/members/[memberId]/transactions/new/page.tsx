"use server";

import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTransactionApi} from "@repo/actions/tahsilet/TahsiletService/actions";
import {getClientManagerToken, getIntegrationManagerToken} from "@repo/actions/tahsilet/FaturaturkaService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import {getBaseLink} from "src/utils";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: {
    memberId: string;
    lang: string;
  };
}) {
  const {lang, memberId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TahsilEt.Transactions"],
    lang,
  });

  const transctionResponse = await getTransactionApi({
    memberId,
  });
  const cmToken = await getClientManagerToken();
  const imToken = await getIntegrationManagerToken();
  if (isErrorOnRequest(transctionResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={transctionResponse.message} />;
  }
  if (!cmToken.success || !cmToken.data) {
    return <ErrorComponent languageData={languageData} message={cmToken.error} />;
  }
  if (!imToken.success || !imToken.data) {
    return <ErrorComponent languageData={languageData} message={imToken.error} />;
  }
  return (
    <>
      <Form
        cmToken={cmToken.data}
        imToken={imToken.data.access_token}
        languageData={languageData}
        memberId={memberId}
      />
      <div className="hidden" id="page-description">
        {languageData["Member.Edit.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`members/${memberId}/transactions`, lang)}
      </div>
    </>
  );
}
