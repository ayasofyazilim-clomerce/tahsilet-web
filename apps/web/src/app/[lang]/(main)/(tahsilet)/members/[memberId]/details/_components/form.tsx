"use client";

import type {
  TahsilEt_Members_IdType,
  TahsilEt_Members_ListMemberResponseDto,
} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {handlePutResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {z} from "zod";
import {putMemberByIdApi} from "@repo/actions/tahsilet/TahsiletService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  memberDetailsData,
  memberId,
}: {
  languageData: IdentityServiceResource;
  memberDetailsData: TahsilEt_Members_ListMemberResponseDto[];
  memberId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const memberType = memberDetailsData[0].type === "Individual" ? "Individual" : "Organization";

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
      formSchema={memberType === "Individual" ? individualFormSchema : organizationFormSchema}
      onSubmit={(formData) => {
        startTransition(() => {
          void putMemberByIdApi({
            id: memberId,
            requestBody: {
              ...formData,
              type: memberType,
              idType: formData.idType as TahsilEt_Members_IdType,
              identifier: formData.identifier as string,
              paymentFreqDays: formData.paymentFreqDays as number,
            },
          }).then((res) => {
            handlePutResponse(res, router, "..");
          });
        });
      }}
      stickyChildren
      stickyChildrenClassName="sticky px-6"
      values={memberDetailsData[0]}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}
