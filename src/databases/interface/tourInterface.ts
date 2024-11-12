'use strict'

import { Tour } from "../models/entities/Tour";

export interface TourData {
    status: number;
    errCode: number | string;
    errMessage: string | object;
    tourInfor?: object; // optional property
    tourArray?: Array<Tour>; 
    total?: number,
    currentPage?: number,
    perPage?: number
}