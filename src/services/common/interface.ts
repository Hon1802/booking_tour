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

export interface FindOptions {
    limit?: number;
    skip?: number;
    // Có thể thêm các tùy chọn khác nếu cần
}