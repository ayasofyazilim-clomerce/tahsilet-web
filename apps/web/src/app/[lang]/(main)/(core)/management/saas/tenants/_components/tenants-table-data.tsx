import {Volo_Saas_Host_Dtos_SaasTenantDto} from "@ayasofyazilim/core-saas/SaasService";
import type {Volo_Abp_TenantManagement_TenantDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$Volo_Abp_TenantManagement_TenantDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {Plus} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

type TenantsTable = TanstackTableCreationProps<Volo_Saas_Host_Dtos_SaasTenantDto>;

const links: Partial<Record<keyof Volo_Saas_Host_Dtos_SaasTenantDto, TanstackTableColumnLink>> = {};

function tenantsTableActions(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["AbpTenantManagement.Tenants.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Tenant.New"],
      icon: Plus,
      onClick: () => {
        router.push("tenants/new");
      },
    });
  }
  return actions;
}
const tenantsColumns = (
  locale: string,
  languageData: SaasServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["AbpTenantManagement.Tenants.Update"], grantedPolicies)) {
    links.name = {
      prefix: "tenants",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_TenantManagement_TenantDto>({
    rows: $Volo_Abp_TenantManagement_TenantDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Tenant",
    },
    config: {
      locale,
    },
    links,
  });
};
function tenantsTable(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: TenantsTable = {
    fillerColumn: "name",
    pinColumns: ["name"],
    columnVisibility: {
      type: "show",
      columns: ["name"],
    },
    columnOrder: ["name"],
    filters: {
      textFilters: ["filter"],
    },
    tableActions: tenantsTableActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  tenants: {
    columns: tenantsColumns,
    table: tenantsTable,
  },
};
