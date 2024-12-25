'use strict'

import { Bookings } from "../models/entities/Booking";

export interface IBookingData {
    status: number;
    errCode: number | string;
    errMessage: string | object;
    bookingInfo?: object; // optional property
    bookingArray?: Array<Bookings>; 
    userDepositArray?: Array<any>; 
    total?: number; 
    currentPage?: number; 
    perPage?: number;
    totalRevenue?:number
}
export interface IDataStatic {
    status: number;
    errCode: number | string;
    errMessage: string | object;
    statisticsData? : any
}