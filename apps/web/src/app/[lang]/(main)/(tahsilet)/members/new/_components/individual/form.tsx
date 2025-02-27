"use client";

import type {TahsilEt_Members_IdType} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postMemberApi} from "src/actions/core/TahsiletService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function MemberIndividualForm({languageData}: {languageData: IdentityServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const individualFormSchema = z.object({
    idType: z.enum(["NONE", "TCKN", "YKN", "MKN"]),
    identifier: z
      .string()
      .min(11, "Kimlik numarası 11 haneli olmalıdır.")
      .max(11, "Kimlik numarası 11 haneli olmalıdır.")
      .regex(/^\d{11}$/, "Kimlik numarası sadece rakam içermelidir."),
    paymentFreqDays: z.number().min(1).max(31),
    name: z
      .string()
      .min(2, "İsim en az 2 karakter olmalıdır.")
      .regex(/^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/, "İsim yalnızca harf içermelidir."),
    surname: z
      .string()
      .min(2, "Soyisim en az 2 karakter olmalıdır.")
      .regex(/^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/, "Soyisim yalnızca harf içermelidir."),
    mail: z.string().email("Geçerli bir e-posta adresi giriniz.").optional(),
    tel: z.string().optional(),
  });

  return (
    <AutoForm
      className="grid gap-4 space-y-0 md:grid-cols-2 lg:grid-cols-2"
      fieldConfig={{
        identifier: {
          containerClassName: "pt-3",
        },
      }}
      formSchema={individualFormSchema}
      onSubmit={(formData) => {
        startTransition(() => {
          void postMemberApi({
            requestBody: {
              ...formData,
              type: "Individual",
              idType: formData.idType as TahsilEt_Members_IdType,
              identifier: formData.identifier as string,
              name: formData.name as string,
              surname: formData.surname as string,
              mail: formData.mail as string,
              tel: formData.tel as string,
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
