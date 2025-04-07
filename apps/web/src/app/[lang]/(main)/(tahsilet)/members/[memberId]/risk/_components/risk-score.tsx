"use client";

import {toast} from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
import type {TahsilEt_Members_ListMemberResponseDto} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {triggerTahsiletSendScore} from "@repo/actions/tahsilet/Novu/actions";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {Bell} from "lucide-react";
import {useTransition} from "react";
import type {IdentityServiceResource} from "@/language-data/core/IdentityService";

export default function RiskScore({
  score,
  memberDetails,
  languageData,
}: {
  score: number;
  languageData: IdentityServiceResource;
  memberDetails: TahsilEt_Members_ListMemberResponseDto | null | undefined;
}) {
  const [isPending, startTransition] = useTransition();
  const minScore = 1;
  const maxScore = 1900;
  // const rangeStep = Math.floor((maxScore - minScore) / 5);
  const areas = [
    {
      label: languageData["CreditScore.VeryHighRisk"],
      colors: {text: "text-credit-red", bg: "bg-credit-red"},
      range: [0, 699],
      start: "col-start-1",
    },
    {
      label: languageData["CreditScore.MediumRisk"],
      colors: {text: "text-credit-orange", bg: "bg-credit-orange"},
      range: [700, 1099],
      start: "col-start-2",
    },
    {
      label: languageData["CreditScore.LowRisk"],
      colors: {text: "text-credit-yellow", bg: "bg-credit-yellow"},
      range: [1100, 1499],
      start: "col-start-3",
    },
    {
      label: languageData["CreditScore.Good"],
      colors: {text: "text-credit-teal", bg: "bg-credit-teal"},
      range: [1500, 1699],
      start: "col-start-4",
    },
    {
      label: languageData["CreditScore.VeryGood"],
      colors: {text: "text-credit-green", bg: "bg-credit-green"},
      range: [1700, 1900],
      start: "col-start-5",
    },
  ];
  const activeScore = areas.find((area) => area.range[0] <= score && area.range[1] >= score);
  return (
    <div>
      {memberDetails ? (
        <ActionList>
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "default",
              children: languageData["Member.SendScore.Send"],
              onConfirm: () => {
                startTransition(() => {
                  void triggerTahsiletSendScore({
                    score,
                    subscriberId: memberDetails.id,
                    email: memberDetails.mail || "",
                    phone: memberDetails.tel || "",
                  }).then((res) => {
                    if (res.result.status === "processed") {
                      toast.success(languageData["Member.SendScore.Success"]);
                    } else {
                      toast.error(languageData[res.result.status as keyof typeof languageData]);
                    }
                  });
                });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Member.SendScore.Description"]}
            title={languageData["Member.SendScore"]}
            triggerProps={{
              children: (
                <>
                  <Bell className="mr-2 w-4" /> {languageData["Member.SendScore"]}
                </>
              ),
              variant: "outline",
              disabled: isPending,
            }}
            type="with-trigger"
          />
        </ActionList>
      ) : null}
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center bg-white p-4">
        <h1 className="mb-4 text-3xl font-bold">{languageData.CreditScore}</h1>
        <div className={cn("mb-8 text-8xl font-bold", activeScore?.colors.text)}>{score}</div>
        <div className="relative grid w-full grid-cols-5">
          <span className={cn("col-start-1 text-start text-lg font-bold", areas.at(0)?.colors.text)}>{minScore}</span>
          <span className={cn("col-start-5 text-end text-lg font-bold", areas.at(-1)?.colors.text)}>{maxScore}</span>
          <div className="absolute left-0 right-0 grid w-full grid-cols-5">
            <div className={cn("flex h-4 w-full items-end justify-center overflow-hidden pb-3", activeScore?.start)}>
              <div className={cn("size-9 origin-center -rotate-45 transform bg-black", activeScore?.colors.bg)} />
            </div>
          </div>
        </div>
        <div className="grid h-10 w-full grid-cols-5 overflow-hidden rounded-full text-white">
          {areas.map((area) => (
            <div className={`${area.colors.bg} flex items-center justify-center text-xs font-medium `} key={area.label}>
              {area.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
