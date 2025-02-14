"use server";

import {structuredError, structuredResponse} from "@repo/utils/api";
import {getTahsiletServiceClient} from "src/lib";

export async function deleteRoleByIdApi(id: string) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.role.deleteApiIdentityRolesById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteUserByIdApi(id: string) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.user.deleteApiIdentityUsersById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteTenantsByIdApi(id: string) {
  try {
    const client = await getTahsiletServiceClient();
    const dataResponse = await client.tenant.deleteApiMultiTenancyTenantsById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
