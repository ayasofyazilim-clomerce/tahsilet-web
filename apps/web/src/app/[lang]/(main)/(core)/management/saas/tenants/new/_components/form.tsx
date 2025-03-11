"use client";

import type {Volo_Abp_TenantManagement_TenantCreateDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$Volo_Abp_TenantManagement_TenantCreateDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postTenantApi} from "@repo/actions/tahsilet/TahsiletService/post-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

export default function Form({languageData}: {languageData: SaasServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_TenantManagement_TenantCreateDto,
    resources: languageData,
    name: "Form.Tenant",
    extend: {
      adminPassword: {
        "ui:widget": "password",
      },
    },
  });
  return (
    <SchemaForm<Volo_Abp_TenantManagement_TenantCreateDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postTenantApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../tenants");
          });
        });
      }}
      schema={$Volo_Abp_TenantManagement_TenantCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}
