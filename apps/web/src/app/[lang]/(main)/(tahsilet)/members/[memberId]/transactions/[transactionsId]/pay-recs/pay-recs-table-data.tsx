import type {TahsilEt_PayRecs_PayRecDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {
  $TahsilEt_PayRecs_PayRecDto,
  $TahsilEt_Transactions_Enums_TransactionType,
} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

type TransactionsTable = TanstackTableCreationProps<TahsilEt_PayRecs_PayRecDto>;
const links: Partial<Record<keyof TahsilEt_PayRecs_PayRecDto, TanstackTableColumnLink>> = {};

function transactionsColumns(locale: string, languageData: IdentityServiceResource) {
  return tanstackTableCreateColumnsByRowData<TahsilEt_PayRecs_PayRecDto>({
    rows: $TahsilEt_PayRecs_PayRecDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Transaction.PayRec",
    },
    config: {
      locale,
    },
    links,
    badges: {
      logicalRef: {
        values: $TahsilEt_Transactions_Enums_TransactionType.enum.map((key) => ({
          label: key === "Credit" ? "Payment update" : "Transaction update",
          badgeClassName: key === "Credit" ? "bg-green-500" : "bg-blue-500",
          position: "before",
          conditions: [
            {
              conditionAccessorKey: `sign`,
              when: (value) => value === key,
            },
          ],
        })),
      },
    },
  });
}

export function transactionsTable(): TransactionsTable {
  const table: TransactionsTable = {
    fillerColumn: "logicalRef",
    columnVisibility: {
      type: "show",
      columns: ["logicalRef", "crossRef", "ficheRef", "paidAmount", "amount", "dueDate", "transactionDate"],
    },
    columnOrder: ["logicalRef", "crossRef", "ficheRef", "paidAmount", "amount", "transactionDate", "dueDate"],
  };
  return table;
}

export const tableData = {
  transactions: {
    columns: transactionsColumns,
    table: transactionsTable,
  },
};
