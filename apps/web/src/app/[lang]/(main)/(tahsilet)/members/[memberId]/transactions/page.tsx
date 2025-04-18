"use server";

import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTransactionListWithPayRecsApi} from "@repo/actions/tahsilet/TahsiletService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import TransactionsTable from "./table";

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

  const transctionResponse = await getTransactionListWithPayRecsApi({
    memberId,
  });
  if (isErrorOnRequest(transctionResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={transctionResponse.message} />;
  }

  return <TransactionsTable languageData={languageData} response={transctionResponse.data} />;
}
