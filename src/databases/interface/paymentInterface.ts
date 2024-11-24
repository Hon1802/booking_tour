'use strict'

import { Payments } from "../models/entities/Payment";

export interface PaymentData {
    status: number;
    errCode: number | string;
    errMessage: string | object;
    PaymentInfo?: object; // optional property
    PaymentArray?: Array<Payments>; 
    PaymentData?: Payments;
    total?: number;
    currentPage?: number,
    perPage?: number,
    method?: string,
}