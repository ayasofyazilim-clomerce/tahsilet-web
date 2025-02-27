"use client";

import type {TahsilEt_Transactions_ListTransactionResponseDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams} from "next/navigation";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./pay-recs-table-data";

function TransactionsTable({
  response,
  languageData,
}: {
  response: TahsilEt_Transactions_ListTransactionResponseDto[];
  languageData: IdentityServiceResource;
}) {
  const {lang} = useParams<{
    lang: string;
    memberId: string;
  }>();

  const columns = tableData.transactions.columns(lang, languageData);
  const table = tableData.transactions.table();

  return <TanstackTable {...table} columns={columns} data={response[0].payRecs || []} rowCount={response.length} />;
}

export default TransactionsTable;
