"use client";

import type {PagedResultDto_ListTransactionResponseDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./transactions-table-data";

function TransactionsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ListTransactionResponseDto;
  languageData: IdentityServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang, memberId} = useParams<{
    lang: string;
    memberId: string;
  }>();

  const columns = tableData.transactions.columns(lang, languageData, grantedPolicies, memberId);
  const table = tableData.transactions.table(languageData, router, grantedPolicies, memberId);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default TransactionsTable;
