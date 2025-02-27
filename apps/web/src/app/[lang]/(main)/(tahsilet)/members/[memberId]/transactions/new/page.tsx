"use server";

import { isErrorOnRequest } from "@repo/utils/api";
import { isUnauthorized } from "@repo/utils/policies";
import { getTransactionApi } from "src/actions/core/TahsiletService/actions";
import { getResourceData } from "src/language-data/core/IdentityService";
import { getBaseLink } from "src/utils";
import Form from "./form";
import ErrorComponent from "@repo/ui/components/error-component";

export default async function Page({
  params,
}: {
  params: {
    memberId: string;
    lang: string;
  };
}) {
  const { lang, memberId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TahsilEt.Transactions"],
    lang,
  });

  const transctionResponse = await getTransactionApi({
    memberId,
  });
  if (isErrorOnRequest(transctionResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={transctionResponse.message} />;
  }

  return (
    <>
      <Form languageData={languageData} memberId={memberId} />
      <div className="hidden" id="page-description">
        {languageData["Member.Edit.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`members/${memberId}/transactions`, lang)}
      </div>
    </>
  );
}
