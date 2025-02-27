import type {Volo_Abp_Identity_IdentityUserDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$Volo_Abp_Identity_IdentityUserDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {CheckCircle, Plus, ShieldCheck, XCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

type UsersTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentityUserDto>;

const links: Partial<Record<keyof Volo_Abp_Identity_IdentityUserDto, TanstackTableColumnLink>> = {};
function usersTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["AbpIdentity.Users.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["User.New"],
      icon: Plus,
      onClick: () => {
        router.push("users/new");
      },
    });
  }
  return actions;
}
function usersRowActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_Identity_IdentityUserDto>[] = [];
  if (isActionGranted(["AbpIdentity.Users.ManagePermissions"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["User.Permissions"],
      icon: ShieldCheck,
      onClick: (row) => {
        router.push(`users/${row.id}/permissions`);
      },
    });
  }
  return actions;
}
const usersColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    links.userName = {
      prefix: "users",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentityUserDto>({
    rows: $Volo_Abp_Identity_IdentityUserDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.User",
    },
    config: {
      locale,
    },
    links,
    faceted: {
      isActive: {
        options: [
          {
            label: "Yes",
            when: (value) => {
              return Boolean(value);
            },
            value: "true",
            icon: CheckCircle,
            iconClassName: "text-green-700",
            hideColumnValue: true,
          },
          {
            label: "No",
            when: (value) => {
              return !value;
            },
            value: "false",
            icon: XCircle,
            iconClassName: "text-red-700",
            hideColumnValue: true,
          },
        ],
      },
      lockoutEnabled: {
        options: [
          {
            label: "Yes",
            when: (value) => {
              return Boolean(value);
            },
            value: "true",
            icon: CheckCircle,
            iconClassName: "text-green-700",
            hideColumnValue: true,
          },
          {
            label: "No",
            when: (value) => {
              return !value;
            },
            value: "false",
            icon: XCircle,
            iconClassName: "text-red-700",
            hideColumnValue: true,
          },
        ],
      },
    },
  });
};

function usersTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: UsersTable = {
    fillerColumn: "userName",
    pinColumns: ["userName"],
    columnVisibility: {
      type: "show",
      columns: [
        "userName",
        "email",
        "phoneNumber",
        "name",
        "surname",
        "isActive",
        "lockoutEnabled",
        "accessFailedCount",
        "creationTime",
        "lastModificationTime",
      ],
    },
    columnOrder: [
      "userName",
      "email",
      "phoneNumber",
      "name",
      "surname",
      "isActive",
      "lockoutEnabled",
      "accessFailedCount",
      "creationTime",
      "lastModificationTime",
    ],
    filters: {
      textFilters: ["filter"],
    },
    tableActions: usersTableActions(languageData, router, grantedPolicies),
    rowActions: usersRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  users: {
    columns: usersColumns,
    table: usersTable,
  },
};
