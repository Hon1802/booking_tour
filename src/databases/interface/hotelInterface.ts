'use strict'

import { Hotels } from "../models/entities/Hotel";

export interface IHotelData {
    status: number;
    errCode: number | string;
    errMessage: string | object;
    hotelInfo?: object; // optional property
    hotelArray?: Array<Hotels>; 
    total?: number; 
        currentPage?: number; 
        perPage?: number 
}