"use client";

import SelectTabs, {SelectTabsContent} from "@repo/ayasofyazilim-ui/molecules/select-tabs";
import {Building2, User} from "lucide-react";
import {useState} from "react";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import MemberIndividualForm from "./_components/individual/form";
import MemberOrganizationForm from "./_components/organization/form";

type TabSection = "Organization" | "Individual";
export default function PageClientSide({languageData}: {languageData: IdentityServiceResource}) {
  const [activeTab, setActiveTab] = useState<TabSection>("Individual");

  return (
    <>
      <div className="mb-3">
        <SelectTabs
          onValueChange={(value) => {
            setActiveTab(value as TabSection);
          }}
          value={activeTab}>
          <SelectTabsContent value="Individual">
            <div className="flex flex-row items-center gap-1">
              <User />
              Individual
            </div>
          </SelectTabsContent>
          <SelectTabsContent value="Organization">
            <div className="flex flex-row items-center gap-1">
              <Building2 />
              Organization
            </div>
          </SelectTabsContent>
        </SelectTabs>
      </div>
      {activeTab === "Individual" ? (
        <MemberIndividualForm languageData={languageData} />
      ) : (
        <MemberOrganizationForm languageData={languageData} />
      )}
    </>
  );
}
