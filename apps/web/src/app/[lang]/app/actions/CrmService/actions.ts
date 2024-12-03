"use server";
import type {
  GetApiCrmServiceCustomsData,
  GetApiCrmServiceIndividualsData,
  GetApiCrmServiceMerchantsByIdSubMerchantsData,
  GetApiCrmServiceMerchantsData,
  GetApiCrmServiceMerchantsResponse,
  GetApiCrmServiceTaxOfficesData,
  UniRefund_CRMService_Merchants_MerchantProfileDto,
  UniRefund_CRMService_Merchants_StoreProfilePagedResultDto,
} from "@ayasofyazilim/saas/CRMService";
import type { ServerResponse } from "src/lib";
import { structuredError, structuredResponse } from "src/lib";
import { getApiRequests } from "../api-requests";

export async function getMerchantsApi(
  data: GetApiCrmServiceMerchantsData = {},
): Promise<ServerResponse<GetApiCrmServiceMerchantsResponse>> {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantByIdApi(
  id: string,
): Promise<ServerResponse<UniRefund_CRMService_Merchants_MerchantProfileDto>> {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.getById(id);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getSubMerchantsByMerchantIdApi(
  data: GetApiCrmServiceMerchantsByIdSubMerchantsData,
): Promise<
  ServerResponse<UniRefund_CRMService_Merchants_StoreProfilePagedResultDto>
> {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.getSubCompanies({
      ...data,
      maxResultCount: data.maxResultCount || 10,
      skipCount: data.skipCount || 0,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getTaxOfficesApi(
  data: GetApiCrmServiceTaxOfficesData = {},
) {
  try {
    const requests = await getApiRequests();
    const response = await requests["tax-offices"].get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getCustomsApi(data: GetApiCrmServiceCustomsData = {}) {
  try {
    const requests = await getApiRequests();
    const response = await requests.customs.get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getBasicInformationApi(
  id: string,
  partyName: "merchants",
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].getBasicInformation({
      id,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAdressesApi(id: string, partyName: "merchants") {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].getAdresses({
      id,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getIndividualsApi(
  data: GetApiCrmServiceIndividualsData = {},
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.individuals.get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAffiliationCodeApi(partyName: "individuals") {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].getAffiliationCode();
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
