"use server";

import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import {getTransactionApi} from "src/actions/core/TahsiletService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {getBaseLink} from "src/utils";
import Form from "./_components/form";

export default async function Page({
  params,
}: {
  params: {
    memberId: string;
    transactionsId: string;
    lang: string;
  };
}) {
  const {lang, memberId, transactionsId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TahsilEt.Transactions"],
    lang,
  });

  const transctionDetailsResponse = await getTransactionApi({
    id: transactionsId,
  });
  if (isErrorOnRequest(transctionDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={transctionDetailsResponse.message} />;
  }

  return (
    <>
      <Form
        languageData={languageData}
        transactionData={transctionDetailsResponse.data.items || []}
        transactionId={transactionsId}
      />

      <div className="hidden" id="page-back-link">
        {getBaseLink(`members/${memberId}/transactions`, lang)}
      </div>
    </>
  );
}
