// Types
interface AdditionalInfo {
    print?: boolean; // true ise POS slip basar 
    receiptImage?: boolean; // true ise slip, Response da Base64 formatında resim olarak dönülür. 
    customerReceiptImageEnabled?: boolean; // true ise müşteri slip, Base64 formatında png olarak dönülür. 
    merchantReceiptImageEnabled?: boolean; // true ise işyeri slip, Base64 formatında png olarak dönülür. 
    receiptWidth?: string; // istek doğrultusunda dönen resim slip "80mm" ve ya "58mm" olarak set edilebilir. 
    headUnmaskLength?: number; // kart numarası baştan ilk dört hane açık 
    tailUnmaskLength?: number; // kart numarası sondan dört hane açık 
    printImage?: string; // base64 formatında jpg veya png dosyası (PrintOut için)
}

export interface TransactionHandle {
    SerialNumber: string;
    TransactionDate: string;
    TransactionSequence: number | null;
    Fingerprint: string;
}

interface CancelPaymentParams {
    Url: string;
    Cancel: {
        Amount: number;
        acquirerReference: string;
        retrievalReferenceNo: string;
        AdditionalInfo?: AdditionalInfo;
    };
    TransactionHandle: TransactionHandle;
}

interface LoyaltyInquiryParams {
    Loyalty: {
        AdditionalInfo?: AdditionalInfo;
    };
    TransactionHandle: TransactionHandle;
}

interface PairingParams {
    Url: string;
    TransactionHandle?: TransactionHandle;
}

interface PerformEODParams {
    PerformEOD: {
        AdditionalInfo?: AdditionalInfo;
    };
    TransactionHandle: TransactionHandle;
}

export interface PingParams {
    Url: string;
    TransactionHandle: TransactionHandle;
}

interface PrintOutParams {
    Url: string;
    Print: {
        AdditionalInfo: {
            printImage: string; // base64 formatında jpg veya png dosyası
        };
    };
    TransactionHandle: TransactionHandle;
}

interface RefundPaymentParams {
    Url: string;
    Refund: {
        Amount: number; // İade edilecek tutar TL cinsinden 
        acquirerReference: string; // StartPayment.acquirerReference
        retrievalReferenceNo: string; // StartPayment.retrievalReferenceNo
        AdditionalInfo?: AdditionalInfo;
    };
    TransactionHandle: TransactionHandle;
}
export interface PaymentData {
    Amount: number; // ödeme alınacak miktar TL cinsinden 
    installmentCount?: number; // taksitli satış yapılacaksa bu parametre ile taksit sayısı ayarlanmalıdır. Min 2 
    puan?: number; // puan kullanılacak ise bu bilgi gönderilmeli. Amount ve puan aynı anda kullanılamaz 
    maxInstallmentCount?: number;
    minInstallmentCount?: number;
    IsPfInstallmentEnabled?: boolean; // Paraf taksitli satış için true gönderilmeli
    CurrencyCode?: string;
    AdditionalInfo?: AdditionalInfo;
};
interface StartPaymentParams {
    Url: string;
    Payment: PaymentData;
    TransactionHandle: TransactionHandle;
}

export interface ApiResponse<T = any> {
    HasError?: boolean;
    HasAbondon?: boolean;
    Code?: number;
    Message?: string;
    Successful?: boolean;
    Data?: T;
    Error?: {
        Type?: string;
        Timestamp?: string;
        Endpoint?: string;
        Details?: any;
    };
    TransactionHandle: TransactionHandle;
}

interface CustomHeaders {
    [key: string]: string;
}

// Error Types
enum ErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    CLIENT_ERROR = 'CLIENT_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    POS_ERROR = 'POS_ERROR'
}

interface SmartPOSError {
    type: ErrorType;
    message: string;
    code?: number;
    details?: any;
    timestamp: string;
    endpoint?: string;
    statusCode?: number;
}

interface ErrorHandlerOptions {
    logErrors?: boolean;
    throwOnError?: boolean;
    includeStackTrace?: boolean;
}

// Utility functions
function IsObjectNullOrEmpty(obj: any): boolean {
    return obj === null || obj === undefined || obj === '' ||
        (typeof obj === 'object' && Object.keys(obj).length === 0);
}

// Enhanced Error Handler Class


/**
 * Handle HTTP Response errors
 */
async function handleHttpError(response: Response, endpoint?: string): Promise<ApiResponse> {
    const error = await createErrorFromResponse(response, endpoint);
    // logError(error);
    // Always return a valid ApiResponse, never null
    return {
        Successful: false,
        HasError: true,
        Code: error.code || response.status,
        Message: error.message,
        Data: null,
        Error: {
            Type: error.type,
            Details: error.details,
            Timestamp: error.timestamp,
            Endpoint: endpoint
        },
        TransactionHandle: {
            Fingerprint: '',
            SerialNumber: '',
            TransactionSequence: null,
            TransactionDate: ''
        }
    };
}

/**
 * Handle JavaScript/Network errors
 */
function handleJavaScriptError(error: Error | unknown, endpoint?: string): SmartPOSError {
    let posError: SmartPOSError;

    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            posError = {
                type: ErrorType.TIMEOUT_ERROR,
                message: 'Request timeout. The POS device did not respond within the expected time.',
                timestamp: new Date().toISOString(),
                endpoint,
            };
        } else if (error.message.includes('fetch')) {
            posError = {
                type: ErrorType.NETWORK_ERROR,
                message: 'Network connection failed. Please check your internet connection and POS device connectivity.',
                timestamp: new Date().toISOString(),
                endpoint,
            };
        } else {
            posError = {
                type: ErrorType.UNKNOWN_ERROR,
                message: error.message || 'An unexpected error occurred.',
                timestamp: new Date().toISOString(),
                endpoint,
            };
        }
    } else {
        posError = {
            type: ErrorType.UNKNOWN_ERROR,
            message: 'An unknown error occurred.',
            timestamp: new Date().toISOString(),
            endpoint,
            details: String(error)
        };
    }

    // logError(posError);
    return posError;
}

/**
 * Create structured error from HTTP response
 */
async function createErrorFromResponse(response: Response, endpoint?: string): Promise<SmartPOSError> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorType = ErrorType.SERVER_ERROR;
    let errorCode = response.status;
    let errorDetails: any = {};

    try {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            const responseBody = await response.json();

            // Handle different response formats
            if (responseBody.Message) {
                errorMessage = responseBody.Message;
            } else if (responseBody.message) {
                errorMessage = responseBody.message;
            } else if (responseBody.error) {
                errorMessage = responseBody.error;
            }

            if (responseBody.Code) {
                errorCode = responseBody.Code;
            }

            // Handle validation errors
            if (responseBody.errors) {
                errorType = ErrorType.VALIDATION_ERROR;
                const validationErrors: string[] = [];

                if (typeof responseBody.errors === 'object') {
                    Object.entries(responseBody.errors).forEach(([field, messages]) => {
                        if (Array.isArray(messages)) {
                            validationErrors.push(`${field}: ${messages.join(', ')}`);
                        } else {
                            validationErrors.push(`${field}: ${messages}`);
                        }
                    });
                }

                errorMessage = validationErrors.length > 0
                    ? `Validation failed: ${validationErrors.join('; ')}`
                    : errorMessage;

                errorDetails.validationErrors = responseBody.errors;
            }

            errorDetails.responseBody = responseBody;
        } else {
            // Handle non-JSON responses
            const textResponse = await response.text();
            if (textResponse) {
                errorMessage = textResponse.replace(/"/g, '');
                errorDetails.responseText = textResponse;
            }
        }
    } catch (parseError) {
        errorMessage = `Failed to parse error response: ${response.statusText}`;
        errorDetails.parseError = parseError instanceof Error ? parseError.message : String(parseError);
    }

    // Determine error type based on status code
    if (response.status >= 400 && response.status < 500) {
        if (response.status === 401 || response.status === 403) {
            errorType = ErrorType.AUTHENTICATION_ERROR;
        } else if (response.status === 422) {
            errorType = ErrorType.VALIDATION_ERROR;
        } else {
            errorType = ErrorType.CLIENT_ERROR;
        }
    } else if (response.status >= 500) {
        errorType = ErrorType.SERVER_ERROR;
    }

    // Special handling for POS-specific errors
    if (errorCode === 444) {
        errorType = ErrorType.POS_ERROR;
        errorMessage = 'POS operation was cancelled or interrupted.';
    }

    return {
        type: errorType,
        message: errorMessage,
        code: errorCode,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
        endpoint,
        details: errorDetails
    };
}

/**
 * Log error with proper formatting
 */
function logError(error: SmartPOSError): void {
    const logData = {
        timestamp: error.timestamp,
        type: error.type,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        endpoint: error.endpoint,
        user: 'ertugrulcan-ays',
        ...(error.details && { details: error.details })
    };

    console.error('SmartPOS Error:', JSON.stringify(logData, null, 2));
}

/**
 * Create standardized API response from error
 */
function createErrorResponse(error: SmartPOSError): ApiResponse {
    return {
        Successful: false,
        HasError: true,
        Code: error.code || 500,
        Message: error.message,
        Data: null,
        Error: {
            Type: error.type,
            Timestamp: error.timestamp,
            Endpoint: error.endpoint,
            Details: error.details
        },
        TransactionHandle: {
            Fingerprint: '',
            SerialNumber: '',
            TransactionSequence: null,
            TransactionDate: ''
        }
    };
}


async function makeRequest(
    url: string,
    endpoint: string,
    data: any,
    customHeaders: CustomHeaders = {}
): Promise<ApiResponse> {

    // Create abort controller for timeout

    try {
        const headers = {
            ...customHeaders
        };

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
            credentials: 'omit',
            mode: 'cors'
        };

        const response = await fetch(url + "/" + endpoint, requestOptions);

        // Handle successful responses
        if (response.status >= 200 && response.status < 300) {
            return await response.json();
        }

        // Handle error responses - this always returns ApiResponse, never null
        return await handleHttpError(response, endpoint);

    } catch (error) {

        const posError = handleJavaScriptError(error, endpoint);
        return createErrorResponse(posError);
    }
}

/**
 * Cancel a payment transaction
 */
// async function cancelPayment(params: CancelPaymentParams): Promise<ApiResponse> {
//     if (IsObjectNullOrEmpty(params)) {
//         throw new Error('CancelPayment params cannot be empty');
//     }

//     return await makeRequest(params.Url, 'CancelPayment', params);
// }


/**
 * Perform device pairing
 */
// async function pairing(params: PairingParams): Promise<boolean> {
//     if (IsObjectNullOrEmpty(params)) {
//         throw new Error('Pairing params cannot be empty');
//     }

//     if (!params.TransactionHandle) {
//         const response = await makeRequest(params.Url, 'Pairing', params);

//         if (response.Successful !== false && response.Code !== 444) {
//             if (response && Object.hasOwn(response, "HasError")) {
//                 return !response.HasError;
//             }
//         }
//         return false;
//     }
//     return true;
// }

// /**
//  * Perform End of Day operations
//  */
// async function performEOD(params: PerformEODParams): Promise<ApiResponse> {
//   if (IsObjectNullOrEmpty(params)) {
//     throw new Error('PerformEOD params cannot be empty');
//   }

//   return await makeRequest(params.Url,'PerformEOD', params);
// }

/**
 * Ping the POS device
 */
export type ApiMessage = ApiResponse<PingParams["TransactionHandle"]>
export async function ping(params: PingParams): Promise<ApiMessage> {
    if (IsObjectNullOrEmpty(params)) {
        throw new Error('Ping params cannot be empty');
    }
    return await makeRequest(params.Url, 'Ping', params);
}

/**
 * Print out image to POS device
 */
export async function printOut(params: PrintOutParams): Promise<ApiResponse> {
    if (IsObjectNullOrEmpty(params)) {
        throw new Error('PrintOut params cannot be empty');
    }

    return await makeRequest(params.Url, 'PrintOut', params);
}

/**
 * Refund a payment
 */
export async function refundPayment(params: RefundPaymentParams): Promise<ApiResponse> {
    if (IsObjectNullOrEmpty(params)) {
        throw new Error('RefundPayment params cannot be empty');
    }
    return await makeRequest(params.Url, 'RefundPayment', params);
}

/**
 * Start a payment transaction
 */
export async function startPayment(params: StartPaymentParams): Promise<ApiResponse> {
    if (IsObjectNullOrEmpty(params)) {
        throw new Error('StartPayment params cannot be empty');
    }
    return await makeRequest(params.Url, 'StartPayment', params);
}

/**
 * Create a default TransactionHandle with current timestamp
 */
export async function createTransactionHandle(serialNumber: string, sequence: number, fingerprint: string): Promise<TransactionHandle> {
    return {
        SerialNumber: serialNumber,
        TransactionDate: new Date().toISOString(),
        TransactionSequence: sequence,
        Fingerprint: fingerprint
    };
}

/**
 * Create default AdditionalInfo
 */
export async function createAdditionalInfo(options: Partial<AdditionalInfo> = {}): Promise<AdditionalInfo> {
    return {
        print: false,
        receiptImage: false,
        customerReceiptImageEnabled: false,
        merchantReceiptImageEnabled: false,
        receiptWidth: "80mm",
        headUnmaskLength: 4,
        tailUnmaskLength: 4,
        ...options
    };
}
