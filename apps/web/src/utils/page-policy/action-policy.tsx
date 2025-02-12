"use client";
import type {Policy} from "@repo/utils/policies";

export default function isActionGranted(
  requiredPolicies: Policy[],
  grantedPolicies: Record<Policy, boolean> | undefined,
) {
  const missingPolicies = requiredPolicies.filter((policy) => !grantedPolicies?.[policy]);
  if (missingPolicies.length > 0) {
    return false;
  }
  return true;
}
