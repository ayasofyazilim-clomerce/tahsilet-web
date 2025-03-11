"use client";

import {$TahsilEt_Transactions_CreateTransactionDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postTransactionApi} from "@repo/actions/tahsilet/TahsiletService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({languageData, memberId}: {languageData: IdentityServiceResource; memberId: string}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $TahsilEt_Transactions_CreateTransactionDto,
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
      onSubmit={({formData}) => {
        startTransition(() => {
          if (!formData) return;
          void postTransactionApi({
            requestBody: {
              ...formData,
              memberId,
            },
          }).then((res) => {
            handlePostResponse(res, router, "../transactions");
          });
        });
      }}
      schema={$TahsilEt_Transactions_CreateTransactionDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      useDependency
    />
  );
}
