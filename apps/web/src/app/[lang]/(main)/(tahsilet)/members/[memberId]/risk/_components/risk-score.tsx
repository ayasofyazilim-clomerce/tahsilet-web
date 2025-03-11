"use client";

import {cn} from "@/lib/utils";

export default function RiskScore({score}: {score: number}) {
  const minScore = 1;
  const maxScore = 1900;
  const rangeStep = Math.floor((maxScore - minScore) / 5);
  const areas = [
    {
      label: "EN RİSKLİ",
      colors: {text: "text-credit-red", bg: "bg-credit-red"},
      range: [minScore, minScore + rangeStep - 1],
      start: "col-start-1",
    },
    {
      label: "ORTA RİSKLİ",
      colors: {text: "text-credit-orange", bg: "bg-credit-orange"},
      range: [minScore + rangeStep, minScore + 2 * rangeStep - 1],
      start: "col-start-2",
    },
    {
      label: "AZ RİSKLİ",
      colors: {text: "text-credit-yellow", bg: "bg-credit-yellow"},
      range: [minScore + 2 * rangeStep, minScore + 3 * rangeStep - 1],
      start: "col-start-3",
    },
    {
      label: "İYİ",
      colors: {text: "text-credit-teal", bg: "bg-credit-teal"},
      range: [minScore + 3 * rangeStep, minScore + 4 * rangeStep - 1],
      start: "col-start-4",
    },
    {
      label: "ÇOK RİSKLİ",
      colors: {text: "text-credit-green", bg: "bg-credit-green"},
      range: [minScore + 4 * rangeStep, maxScore],
      start: "col-start-5",
    },
  ];
  const activeScore = areas.find((area) => area.range[0] <= score && area.range[1] >= score);
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center bg-white p-4">
      <h1 className="mb-4 text-3xl font-bold">Kredi Notu</h1>
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
  );
}
