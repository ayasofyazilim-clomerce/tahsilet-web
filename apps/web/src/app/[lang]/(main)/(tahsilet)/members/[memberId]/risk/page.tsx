import {getMemberApi, getTransactionScorePrediction} from "@repo/actions/tahsilet/TahsiletService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "@/language-data/core/IdentityService";
import RiskScore from "./_components/risk-score";

async function getApiRequests({memberId}: {memberId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getTransactionScorePrediction(memberId.toUpperCase(), session),
      getMemberApi(
        {
          id: memberId,
        },
        session,
      ),
    ]);

    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({params}: {params: {lang: string; memberId: string}}) {
  const {memberId, lang} = params;
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests({memberId});
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} signOutServer={signOutServer} />;
  }
  const [scorePrediction, member] = apiRequests.requiredRequests;

  return (
    <RiskScore
      languageData={languageData}
      memberDetails={member.data.items?.at(0)}
      score={Number(scorePrediction.data.score.toFixed())}
    />
  );
}
