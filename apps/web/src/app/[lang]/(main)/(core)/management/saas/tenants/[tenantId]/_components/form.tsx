"use client";

import type {Volo_Abp_TenantManagement_TenantDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {$Volo_Abp_TenantManagement_TenantUpdateDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handleDeleteResponse, handlePostResponse} from "@repo/utils/api";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {deleteTenantsByIdApi} from "@repo/actions/tahsilet/TahsiletService/delete-actions";
import {putTenantApi} from "@repo/actions/tahsilet/TahsiletService/put-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

export default function Form({
  languageData,
  tenantDetailsData,
}: {
  languageData: SaasServiceResource;
  tenantDetailsData: Volo_Abp_TenantManagement_TenantDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {grantedPolicies} = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_TenantManagement_TenantUpdateDto,
    resources: languageData,
    name: "Form.Tenant",
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["AbpTenantManagement.Tenants.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                startTransition(() => {
                  void deleteTenantsByIdApi(tenantDetailsData.id || "").then((res) => {
                    handleDeleteResponse(res, router, "../tenants");
                  });
                });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Tenant.Delete"]}
            triggerProps={{
              children: (
                <>
                  <Trash2 className="mr-2 w-4" /> {languageData.Delete}
                </>
              ),
              variant: "outline",
              disabled: isPending,
            }}
            type="with-trigger"
          />
        )}
      </ActionList>
      <SchemaForm<Volo_Abp_TenantManagement_TenantDto>
        className="flex flex-col gap-4"
        disabled={isPending}
        filter={{
          type: "exclude",
          keys: ["concurrencyStamp"],
        }}
        formData={tenantDetailsData}
        onSubmit={({formData}) => {
          startTransition(() => {
            void putTenantApi({
              id: tenantDetailsData.id || "",
              requestBody: {...formData, name: formData?.name || ""},
            }).then((res) => {
              handlePostResponse(res, router, "../tenants");
            });
          });
        }}
        schema={$Volo_Abp_TenantManagement_TenantUpdateDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
      />
    </div>
  );
}
