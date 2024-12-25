'use strict'

import { Hotels } from "../models/entities/Hotel";
import { Tour } from "../models/entities/Tour";
import { Transport } from "../models/entities/Transport";

export interface TourData {
    status: number;
    errCode: number | string;
    errMessage: string | object;
    tourInfor?: object; // optional property
    tourArray?: Array<Tour>; 
    total?: number,
    currentPage?: number,
    perPage?: number,
    hotel?: Hotels | null,
    transportation?: Transport | null,
}