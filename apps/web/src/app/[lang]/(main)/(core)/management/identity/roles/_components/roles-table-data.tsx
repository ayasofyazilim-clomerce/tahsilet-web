import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {Plus, ShieldCheck} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

type RolesTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentityRoleDto>;

const links: Partial<Record<keyof Volo_Abp_Identity_IdentityRoleDto, TanstackTableColumnLink>> = {};
const badgeClassNames = {
  Public: "text-blue-500 bg-blue-100 border-blue-500",
  Default: "text-green-500 bg-green-100 border-green-500",
  Static: "text-red-500 bg-red-100 border-red-500",
};
function rolesTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["AbpIdentity.Roles.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Role.New"],
      icon: Plus,
      onClick: () => {
        router.push("roles/new");
      },
    });
  }
  return actions;
}
function rolesRowActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_Identity_IdentityRoleDto>[] = [];
  if (isActionGranted(["AbpIdentity.Roles.ManagePermissions"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["Role.Permissions"],
      icon: ShieldCheck,
      onClick: (row) => {
        router.push(`roles/${row.id}/permissions`);
      },
    });
  }
  return actions;
}
const rolesColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["AbpIdentity.Roles.Update"], grantedPolicies)) {
    links.name = {
      prefix: "roles",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentityRoleDto>({
    rows: $Volo_Abp_Identity_IdentityRoleDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Role",
    },
    config: {
      locale,
    },
    links,
    badges: {
      name: {
        values: Object.keys(badgeClassNames).map((key) => ({
          position: "after",
          label: languageData[`Form.Role.is${key}` as keyof typeof languageData],
          badgeClassName: badgeClassNames[key as keyof typeof badgeClassNames],
          conditions: [
            {
              conditionAccessorKey: `is${key}`,
              when: (value) => value === true,
            },
          ],
        })),
      },
    },
  });
};

function rolesTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: RolesTable = {
    fillerColumn: "name",
    pinColumns: ["name"],
    columnVisibility: {
      type: "show",
      columns: ["name"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: rolesTableActions(languageData, router, grantedPolicies),
    rowActions: rolesRowActions(languageData, router, grantedPolicies),
  };
  return table;
}
export const tableData = {
  roles: {
    columns: rolesColumns,
    table: rolesTable,
  },
};
