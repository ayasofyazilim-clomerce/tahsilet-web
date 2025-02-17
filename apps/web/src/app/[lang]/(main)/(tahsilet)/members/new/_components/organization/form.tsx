"use client";

import type {TahsilEt_Members_IdType} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postMemberApi} from "src/actions/core/TahsiletService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function MemberOrganizationForm({languageData}: {languageData: IdentityServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const organizationFormSchema = z.object({
    idType: z.enum(["VKN"]),
    identifier: z
      .string()
      .min(10, "VKN must be exactly 10 digits")
      .max(10, "VKN must be exactly 10 digits")
      .regex(/^[0-9]+$/, "VKN must contain only numbers"),
    paymentFreqDays: z.number().min(1).max(31),
    title: z.string(),
    mail: z.string().email("Geçerli bir e-posta adresi giriniz.").optional(),
    tel: z
      .string()
      .regex(/^(?:[+]\d{1,2})(?:\d{10})$/, "Invalid telephone format")
      .optional(),
  });

  return (
    <AutoForm
      className="grid gap-4 space-y-0 md:grid-cols-2 lg:grid-cols-2"
      fieldConfig={{
        identifier: {
          containerClassName: "pt-3",
        },
      }}
      formSchema={organizationFormSchema}
      onSubmit={(formData) => {
        startTransition(() => {
          void postMemberApi({
            requestBody: {
              ...formData,
              type: "Organization",
              idType: formData.idType as TahsilEt_Members_IdType,
              identifier: formData.identifier as string,
              mail: formData.mail as string,
              tel: formData.tel as string,
              title: formData.title as string,
              paymentFreqDays: formData.paymentFreqDays as number,
            },
          }).then((res) => {
            handlePostResponse(res, router, "../members");
          });
        });
      }}
      stickyChildren
      stickyChildrenClassName="sticky px-6">
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}
