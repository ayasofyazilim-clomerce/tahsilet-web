"use server";

import type {
  PostApiAccountMyProfileChangePasswordData,
  PostApiIdentityRolesData,
  PostApiIdentityUsersData,
  PostApiMultiTenancyTenantsData,
} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getTahsiletServiceClient} from "src/lib";

export async function postRoleApi(data: PostApiIdentityRolesData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.role.postApiIdentityRoles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postUserApi(data: PostApiIdentityUsersData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.user.postApiIdentityUsers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postTenantApi(data: PostApiMultiTenancyTenantsData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.tenant.postApiMultiTenancyTenants(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postPasswordChangeApi(data: PostApiAccountMyProfileChangePasswordData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.profile.postApiAccountMyProfileChangePassword(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
