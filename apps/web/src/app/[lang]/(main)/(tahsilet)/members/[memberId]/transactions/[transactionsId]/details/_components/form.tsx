"use client";

import type {TahsilEt_Transactions_ListTransactionResponseDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$TahsilEt_Transactions_UpdateTransactionDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {putTransactionByIdApi} from "@repo/actions/tahsilet/TahsiletService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  transactionId,
  transactionData,
}: {
  languageData: IdentityServiceResource;
  transactionId: string;
  transactionData: TahsilEt_Transactions_ListTransactionResponseDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $TahsilEt_Transactions_UpdateTransactionDto,
    resources: languageData,
    name: "Form.Transaction",
    extend: {
      credit: {
        dependencies: [
          {
            target: "transactionType",
            type: DependencyType.HIDES,
            when: (transactionType: string) => transactionType === "Debit",
          },
        ],
      },
      debit: {
        dependencies: [
          {
            target: "transactionType",
            type: DependencyType.HIDES,
            when: (transactionType: string) => transactionType === "Credit",
          },
        ],
      },
    },
  });

  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "include",
        sort: true,
        keys: ["transactionType", "transactionDate", "debit", "credit", "documentType"],
      }}
      formData={transactionData[0]}
      onSubmit={({formData}) => {
        startTransition(() => {
          if (!formData) return;
          void putTransactionByIdApi({
            id: transactionId,
            requestBody: {...formData, credit: formData.credit || 0, debit: formData.debit || 0},
          }).then((res) => {
            handlePostResponse(res, router, "../transactions");
          });
        });
      }}
      schema={$TahsilEt_Transactions_UpdateTransactionDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      useDependency
    />
  );
}
