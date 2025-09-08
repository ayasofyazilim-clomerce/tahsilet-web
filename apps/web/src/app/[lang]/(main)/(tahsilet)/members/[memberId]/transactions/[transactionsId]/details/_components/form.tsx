"use client";

import type {
  TahsilEt_Transactions_ListTransactionResponseDto,
  TahsilEt_Transactions_UpdateTransactionDto,
} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$TahsilEt_Transactions_UpdateTransactionDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {putTransactionByIdApi} from "@repo/actions/tahsilet/TahsiletService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
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
  const documentTypes = ["Invoice", "Check", "PromissoryNote", "CreditCard", "Cash"];
  const documentType = !isNaN(transactionData[0].documentType as unknown as number)
    ? documentTypes[transactionData[0].documentType as keyof typeof documentTypes]
    : transactionData[0].documentType;
  return (
    <SchemaForm<TahsilEt_Transactions_UpdateTransactionDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "include",
        sort: true,
        keys: ["transactionType", "transactionDate", "debit", "credit", "documentType"],
      }}
      formData={{
        ...transactionData[0],
        debit: transactionData[0].debit || 0,
        credit: transactionData[0].credit || 0,
        documentType: documentType as unknown as TahsilEt_Transactions_UpdateTransactionDto["documentType"],
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          if (!formData) return;
          void putTransactionByIdApi({
            id: transactionId,
            requestBody: {
              ...formData,
              credit: formData.credit || 0,
              debit: formData.debit || 0,
              documentType: formData.documentType,
            },
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
