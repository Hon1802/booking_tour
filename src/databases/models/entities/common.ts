export enum OrderStatus {
    WAITING_CONFIRM = 'WAITING_CONFIRM',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    CANCELLED_BY_ADMIN = 'CANCELLED_BY_ADMIN',
    REFUND_COMPLETED = 'REFUND_COMPLETED'
  }
  
export enum PaymentStatus {
    NEW_REQUEST = 'NEW_REQUEST',
    DEPOSIT_ADVANCE = 'DEPOSIT_ADVANCE',
    COMPLETED = 'COMPLETED'
  }

export interface Person {
    firstName: string;
    lastName: string;
  }