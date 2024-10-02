export interface ResponseData {
    status: number;
    code?: number;
    errCode?: string | number;
    errMessage?: string | object;
    message?: string | object;
    ttl?: string | number;
<<<<<<< HEAD
}
export interface DataUserUpdate {
    id: string,
    fullName: string,
    phone?: string,
    birthday?: any,
    gender?: string,
    email: string,
    urlAvatar?:string
=======
>>>>>>> 81ccabe49c3051fea36eb1b880928d2d0782f2b1
}