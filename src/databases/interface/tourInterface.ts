'use strict'

import { Tour } from "../models/entities/Tour";

export interface TourData {
    status: number;
    errCode: number;
    errMessage: string | object;
    tourInfor?: object; // optional property
    tourArray?: Array<Tour>; 
}