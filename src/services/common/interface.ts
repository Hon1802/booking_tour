export interface ResponseData {
    status: number;
    code?: number;
    errCode?: string | number;
    errMessage?: string | object;
    message?: string | object;
    ttl?: string | number;
}