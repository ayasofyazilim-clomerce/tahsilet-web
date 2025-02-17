"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/core/IdentityService";
import PageClientSide from "./page-client";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TahsilEt.Members.Save"],
    lang,
  });

  return (
    <>
      <PageClientSide languageData={languageData} />

      <div className="hidden" id="page-description">
        {languageData["Member.new.description"]}
      </div>
    </>
  );
}
