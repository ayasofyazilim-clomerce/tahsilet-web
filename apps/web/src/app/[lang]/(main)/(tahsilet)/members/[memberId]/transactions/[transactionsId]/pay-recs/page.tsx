"use server";

import { isErrorOnRequest } from "@repo/utils/api";
import { isUnauthorized } from "@repo/utils/policies";
import { getTransactionListWithPayRecsApi } from "src/actions/core/TahsiletService/actions";
import { getResourceData } from "src/language-data/core/IdentityService";
import TransactionsTable from "./table";
import ErrorComponent from "@repo/ui/components/error-component";

export default async function Page({
  params,
}: {
  params: {
    memberId: string;
    transactionsId: string;
    lang: string;
  };
}) {
  const { lang, memberId, transactionsId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TahsilEt.Transactions"],
    lang,
  });

  const transctionPayRecsResponse = await getTransactionListWithPayRecsApi({
    id: transactionsId,
    memberId,
  });
  if (isErrorOnRequest(transctionPayRecsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={transctionPayRecsResponse.message} />;
  }

  return <TransactionsTable languageData={languageData} response={transctionPayRecsResponse.data.items || []} />;
}
