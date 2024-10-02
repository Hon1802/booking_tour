export interface ResponseData {
    status: number;
    code?: number;
    errCode?: string | number;
    errMessage?: string | object;
    message?: string | object;
    ttl?: string | number;
}
export interface DataUserUpdate {
    id: string,
    fullName: string,
    phone?: string,
    birthday?: any,
    gender?: string,
    email: string,
    urlAvatar?:string
}