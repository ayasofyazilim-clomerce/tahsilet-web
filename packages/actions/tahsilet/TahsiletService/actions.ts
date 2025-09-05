"use server";
import type {
  GetApiIdentityRolesData,
  GetApiIdentityUsersData,
  GetApiMemberData,
  GetApiMultiTenancyTenantsData,
  GetApiPermissionManagementPermissionsData,
  GetApiTransactionData,
  GetApiTransactionListWithPayRecsData,
} from "@repo/saas/TAHSILETService";
import { structuredError, structuredResponse, structuredSuccessResponse } from "@repo/utils/api";
import { Session } from "@repo/utils/auth";
import { getTahsiletServiceClient } from "../lib";

export async function getPermissionsApi(data: GetApiPermissionManagementPermissionsData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.permissions.getApiPermissionManagementPermissions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllRolesApi() {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.role.getApiIdentityRolesAll();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRolesApi(data: GetApiIdentityRolesData = {}) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.role.getApiIdentityRoles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRoleDetailsByIdApi(id: string) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.role.getApiIdentityRolesById({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersApi(data: GetApiIdentityUsersData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.user.getApiIdentityUsers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUserDetailsByIdApi(id: string) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersById({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersAssignableRolesApi(id: string) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersByIdRoles({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTenantsApi(data: GetApiMultiTenancyTenantsData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.tenant.getApiMultiTenancyTenants(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTenantDetailsByIdApi(id: string) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.tenant.getApiMultiTenancyTenantsById({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getPersonalInfomationApi() {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.profile.getApiAccountMyProfile();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getMemberApi(data: GetApiMemberData, session?: Session | null) {
  try {
    const client = await getTahsiletServiceClient(session);
    const dataResponse = await client.member.getApiMember(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTransactionApi(data: GetApiTransactionData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.transaction.getApiTransaction(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTransactionListWithPayRecsApi(data: GetApiTransactionListWithPayRecsData) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.transaction.getApiTransactionListWithPayRecs(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTransactionScorePrediction(id: string, session?: Session | null) {
  try {
    const client = await getTahsiletServiceClient(session);
    const dataResponse = await client.transaction.getApiAppTransactionScorePrediction({ cardRef: id });
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
