

"use server"
const BASE_URL = process.env.FATURATURKA_BASE_URL || "";
const USERNAME = process.env.FATURATURKA_USERNAME || "";
const PASSWORD = process.env.FATURATURKA_PASSWORD || "";
const DIVISION = process.env.FATURATURKA_DIVISION || "";

type ClientManagerTokenResponse = string | { Message: string }

export async function getClientManagerToken(sessionId?: string): Promise<ServiceResult<string>> {
    const _sessionId = sessionId || crypto.randomUUID();

    try {
        const response = await fetch(`${BASE_URL}/am/api/sso/ltd?sessionid=${_sessionId}`, {
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify(`${USERNAME};${PASSWORD};${DIVISION}`),
            "method": "POST"
        });
        const result: ClientManagerTokenResponse = await response.json();
        if (!response.ok) {
            return {
                success: false,
                data: null,
                error: typeof result === "string" ? result : result.Message
            };
        }
        return {
            success: true,
            data: _sessionId + "|" + result as string
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

type DivisionList = Array<{
    id: string;
    ui: string;
    d: number;
    cd: string;
    ddn: string;
    dvt: string;
    title: string;
    eii: boolean;
    ebt: boolean;
    erpls: boolean;
    erplo: boolean;
    hlar: boolean;
    hear: boolean;
    head: boolean;
    heor: boolean;
    hepy: boolean;
    hein: boolean;
}>

type DivisionListResponse = DivisionList | { Message: string }

export async function getDivisionList(sessionId?: string): Promise<ServiceResult<DivisionListResponse>> {
    try {
        const _sessionId = sessionId || crypto.randomUUID();

        const response = await fetch(`${BASE_URL}/am/api/sso/li?sessionid=${_sessionId}`, {
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify(`${USERNAME};${PASSWORD}`),
            "method": "POST"
        });

        // Handle HTTP errors
        if (!response.ok) {
            return {
                success: false,
                data: null,
                error: `HTTP Error: ${response.status} ${response.statusText}`
            };
        }

        // Parse JSON response
        const data: DivisionListResponse = await response.json();

        // Check if API returned an error message
        if ('Message' in data) {
            return {
                success: false,
                data: null,
                error: data.Message
            };
        }

        // Validate that we received an array
        if (!Array.isArray(data)) {
            return {
                success: false,
                data: null,
                error: "Invalid response format: expected an array of divisions"
            };
        }

        // Success case
        return {
            success: true,
            data: data
        };

    } catch (error) {
        // Handle network errors, JSON parsing errors, etc.
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}


export interface ServiceResult<T> {
    success: boolean;
    data: T | null;
    error?: string;
}

type IntegrationManagerTokenSuccessResponse = { access_token: string, token_type: string }
type IntegrationManagerTokenErrorResponse = { error: string, error_description: string }

export async function getIntegrationManagerToken(): Promise<ServiceResult<IntegrationManagerTokenSuccessResponse>> {
    try {
        const requestHeaders = new Headers();
        requestHeaders.append("division", DIVISION);
        requestHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", USERNAME);
        urlencoded.append("password", PASSWORD);
        urlencoded.append("grant_type", "password");

        const response = await fetch(`${BASE_URL}/im/v2/api/Integration/token`, {
            method: "POST",
            headers: requestHeaders,
            body: urlencoded,
        });

        const result: IntegrationManagerTokenSuccessResponse | IntegrationManagerTokenErrorResponse = await response.json();

        // Check if response is not ok or if result doesn't have access_token
        if (!response.ok || !result || !('access_token' in result)) {
            const errorResult = result as IntegrationManagerTokenErrorResponse;
            return {
                success: false,
                data: null,
                error: errorResult?.error_description
                    || errorResult?.error
                    || `HTTP ${response.status}: ${response.statusText}`
            };
        }

        return {
            success: true,
            data: result as IntegrationManagerTokenSuccessResponse
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}




export interface PosTerminal {
    id: number
    name: string
    description: string
    division: number
    subDivision: number
    createdOn: string
    updatedOn: string
    branchCode: string
    localIp: string
    isActive: boolean
    httpUrl: string
    httpsUrl: string
    printSetting: boolean
    receiptImage: boolean
    customerReceiptImageEnabled: boolean
    merchantReceiptImageEnabled: boolean
    receiptWidth: string
    headUnmaskLength: number
    tailUnmaskLength: number
    targetFingerPrint: string
    requestTime: string
    approveTime: string
    pairingCode: string
    applicationName: string
    sourceReference: string
    sourceFingerPrint: string
    connectionType: number
}

export async function getPosList({ cmToken, imToken }: { cmToken: string, imToken: string }): Promise<ServiceResult<PosTerminal[]>> {

    const apiURL = `${BASE_URL}/pm/Pos/ListPosTerminals/?token=${cmToken}&branchCode=${2}`
    try {
        const response = await fetch(apiURL, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${imToken}`
            }
        })
        const data = await response.json();
        if (response.ok && data) {
            return {
                success: true,
                data: data
            };
        } else {
            return {
                success: false,
                data: null,
                error: "Failed to fetch POS list"
            };
        }

    } catch (fetchError) {
        return {
            success: false,
            data: null,
            error: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        };
    }
}