'use strict'

import { Transport } from "../models/entities/Transport";

export interface ITransportData {
    status: number;
    errCode: number | string;
    errMessage: string | object;
    transportInfo?: object; // optional property
    transportArray?: Array<Transport>; 
    total?: number; 
    currentPage?: number; 
    perPage?: number 
}