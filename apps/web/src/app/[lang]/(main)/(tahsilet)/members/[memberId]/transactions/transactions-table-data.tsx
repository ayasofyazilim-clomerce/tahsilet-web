import type {TahsilEt_Transactions_ListTransactionResponseDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {
  $TahsilEt_Transactions_Enums_TransactionType,
  $TahsilEt_Transactions_ListTransactionResponseDto,
} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {handleDeleteResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {PlusCircle, Trash2} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {deleteTransactionByIdApi} from "@repo/actions/tahsilet/TahsiletService/delete-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

type TransactionsTable = TanstackTableCreationProps<TahsilEt_Transactions_ListTransactionResponseDto>;
const links: Partial<Record<keyof TahsilEt_Transactions_ListTransactionResponseDto, TanstackTableColumnLink>> = {};

function transactionsTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  memberId: string,
) {
  const actions: TanstackTableTableActionsType<TahsilEt_Transactions_ListTransactionResponseDto>[] = [];
  if (isActionGranted(["TahsilEt.Transactions.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Transaction.New"],
      icon: PlusCircle,
      onClick() {
        router.push(`/members/${memberId}/transactions/new`);
      },
    });
  }
  return actions;
}

function transactionsRowActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<TahsilEt_Transactions_ListTransactionResponseDto>[] = [];
  if (isActionGranted(["TahsilEt.Transactions.Delete"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData.Delete,
      title: languageData.Delete,
      actionLocation: "row",
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Delete.Assurance"],
      icon: Trash2,
      onConfirm: (row) => {
        void deleteTransactionByIdApi(row.id || "").then((res) => {
          handleDeleteResponse(res, router);
        });
      },
    });
  }
  return actions;
}

function transactionsColumns(
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
  memberId: string,
) {
  if (isActionGranted(["TahsilEt.Transactions.Update"], grantedPolicies)) {
    links.logicalRef = {
      prefix: `/members/${memberId}/transactions/`,
      targetAccessorKey: "id",
      suffix: "/details",
    };
  }

  return tanstackTableCreateColumnsByRowData<TahsilEt_Transactions_ListTransactionResponseDto>({
    rows: $TahsilEt_Transactions_ListTransactionResponseDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Transaction",
    },
    config: {
      locale,
    },
    links,
    badges: {
      logicalRef: {
        values: $TahsilEt_Transactions_Enums_TransactionType.enum.map((item) => ({
          label: item,
          position: "before",
          conditions: [
            {
              conditionAccessorKey: `transactionType`,
              when: (value) => value === item,
            },
          ],
        })),
      },
    },
  });
}

export function transactionsTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  memberId: string,
): TransactionsTable {
  const table: TransactionsTable = {
    fillerColumn: "logicalRef",
    columnVisibility: {
      type: "show",
      columns: ["logicalRef", "transactionDate", "debit", "credit", "documentType"],
    },
    columnOrder: ["logicalRef", "debit", "credit", "transactionDate", "documentType"],
    tableActions: transactionsTableActions(languageData, router, grantedPolicies, memberId),
    rowActions: transactionsRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  transactions: {
    columns: transactionsColumns,
    table: transactionsTable,
  },
};
