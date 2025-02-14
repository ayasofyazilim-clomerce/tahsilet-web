"use client";

import type {PagedResultDto_IdentityUserDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./users-table-data";

function UsersTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentityUserDto;
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.users.columns(lang, languageData, grantedPolicies);
  const table = tableData.users.table(languageData, router, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default UsersTable;
