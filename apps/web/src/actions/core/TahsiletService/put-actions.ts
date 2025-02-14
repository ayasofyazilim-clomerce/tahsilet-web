"use server";
import type {
  PutApiAccountMyProfileData,
  PutApiIdentityRolesByIdData,
  PutApiIdentityUsersByIdData,
  PutApiMultiTenancyTenantsByIdData,
  PutApiPermissionManagementPermissionsData,
} from "@ayasofyazilim/tahsilet-saas/TAHSILETService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getTahsiletServiceClient} from "src/lib";

export async function putPermissionsApi(data: PutApiPermissionManagementPermissionsData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.permissions.putApiPermissionManagementPermissions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRoleApi(data: PutApiIdentityRolesByIdData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.role.putApiIdentityRolesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUserApi(data: PutApiIdentityUsersByIdData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.user.putApiIdentityUsersById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTenantApi(data: PutApiMultiTenancyTenantsByIdData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.tenant.putApiMultiTenancyTenantsById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putPersonalInfomationApi(data: PutApiAccountMyProfileData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.profile.putApiAccountMyProfile(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
