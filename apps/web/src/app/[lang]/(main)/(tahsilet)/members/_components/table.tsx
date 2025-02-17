"use client";

import type {PagedResultDto_ListMemberResponseDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./members-table-data";

function MembersTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ListMemberResponseDto;
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.members.columns(lang, languageData, grantedPolicies);
  const table = tableData.members.table(languageData, router, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default MembersTable;
