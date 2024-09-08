'use strict'

export interface TourData {
    status: number;
    errCode: number;
    errMessage: string | object;
    tourInfor?: object; // optional property
}