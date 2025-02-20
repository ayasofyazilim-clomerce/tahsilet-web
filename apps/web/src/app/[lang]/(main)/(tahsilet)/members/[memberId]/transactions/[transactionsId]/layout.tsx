"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getResourceData} from "src/language-data/core/IdentityService";
import {getBaseLink} from "src/utils";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    memberId: string;
    transactionsId: string;
    lang: string;
  };
}) {
  const {memberId, transactionsId, lang} = params;
  const {languageData} = await getResourceData(lang);
  const baseLink = getBaseLink(`members/${memberId}/transactions/${transactionsId}/`, lang);

  return (
    <>
      <TabLayout
        orientation="horizontal"
        tabList={[
          {
            label: "Transaction Info",
            href: `${baseLink}details`,
          },
          {
            label: "Pay Recs",
            href: `${baseLink}pay-recs`,
          },
        ]}
        variant="simple">
        {children}
      </TabLayout>
      <div className="hidden" id="page-description">
        {languageData["Transaction.Edit.Description"]}
      </div>
    </>
  );
}
