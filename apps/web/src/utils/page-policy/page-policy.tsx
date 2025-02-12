"use server";
import {permanentRedirect, RedirectType} from "next/navigation";
import type {Policy} from "@repo/utils/policies";
import {getGrantedPoliciesApi} from "src/actions/core/AccountService/actions";

export default async function PagePolicy({
  requiredPolicies,
  children,
  lang,
}: {
  requiredPolicies: Policy[];
  children: JSX.Element;
  lang: string;
}) {
  const grantedPolicies = await getGrantedPoliciesApi();

  const missingPolicies = requiredPolicies.filter((policy) => !grantedPolicies?.[policy]);
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }

  return children;
}

export async function isUnauthorized({requiredPolicies, lang}: {requiredPolicies: Policy[]; lang: string}) {
  const grantedPolicies = await getGrantedPoliciesApi();

  const missingPolicies = requiredPolicies.filter((policy) => !grantedPolicies?.[policy]);
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }
  return false;
}
