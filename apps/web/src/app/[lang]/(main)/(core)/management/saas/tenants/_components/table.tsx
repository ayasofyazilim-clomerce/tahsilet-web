"use client";

import type {PagedResultDto_TenantDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {SaasServiceResource} from "src/language-data/core/SaasService";
import {tableData} from "./tenants-table-data";

function TenantsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_TenantDto;
  languageData: SaasServiceResource;
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();

  const columns = tableData.tenants.columns(lang, languageData, grantedPolicies);
  const table = tableData.tenants.table(languageData, router, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default TenantsTable;
