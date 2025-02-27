"use client";

import type {Volo_Abp_Identity_IdentityRoleCreateDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$Volo_Abp_Identity_IdentityRoleCreateDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postRoleApi} from "src/actions/core/TahsiletService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({languageData}: {languageData: IdentityServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityRoleCreateDto,
    resources: languageData,
    name: "Form.Role",
    extend: {
      isDefault: {
        "ui:widget": "switch",
      },
      isPublic: {
        "ui:widget": "switch",
      },
    },
  });
  return (
    <SchemaForm<Volo_Abp_Identity_IdentityRoleCreateDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postRoleApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../roles");
          });
        });
      }}
      schema={$Volo_Abp_Identity_IdentityRoleCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}
