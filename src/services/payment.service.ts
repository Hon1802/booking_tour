'use strict'
import { validate } from 'class-validator';
import { AppDataSource } from '../databases/connectDatabase';
import { PaymentData } from '../databases/interface/paymentInterface';
import { Payments } from '../databases/models/entities/Payment';
import { logger } from '../log';
// lodash
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import errorCodes from '../common/errorCode/errorCodes';
import tourService from './tour.service';
import { BookingService } from './booking.service';
const managerPayment = AppDataSource.mongoManager;
class PaymentService {

    // Payment
    payment = async (dataPayment: any): Promise<PaymentData> =>{
        try{
            let paymentData: PaymentData;
            const payment = new Payments();
            if(!dataPayment?.bookingId){
                console.log(dataPayment.bookingId)
                paymentData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "Id booking",
                        "constraints": {
                            "Unknown": "Id booking is required"
                        }
                    }
                  };
                return paymentData;
            }

            if (!ObjectId.isValid(dataPayment?.bookingId)) {
                paymentData = {
                  status: 400,
                  errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
                  errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
                };
                logger.error('error id');
                return paymentData;
              }
            const booking = new BookingService();
            const checkBooking = await booking.checkBooking(dataPayment?.bookingId)
            if(!checkBooking)
            {
                paymentData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "Booking not found",
                        "constraints": {
                            "Unknown": "Booking not found"
                        }
                    }
                  };
                return paymentData;
            }
            payment.bookingId = dataPayment?.bookingId;
            payment.paymentMethod = dataPayment?.payment_method;
            payment.depositAmount = dataPayment?.depositAmount;
            payment.totalAmount = dataPayment?.totalAmount;
            payment.status = dataPayment?.status;
            payment.paymentAccount = dataPayment?.paymentAccount;
            payment.payerName = dataPayment?.payerName;
            payment.delFlg = 0;
            const errors = await validate(payment);
            if (errors.length > 0) {
                paymentData = {
                  status: 400,
                  errCode: 400,
                  errMessage: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                  }))
                };
              } else {
                const newPayment = await managerPayment.save(payment);
                logger.info('Payment saved:');
                const formatPayment = _.omit(newPayment, [
                    'createdAt', 
                    'updatedAt', 
                    'startDay', 
                    'endDay', 
                    'createdBy', 
                    'updatedBy', 
                    'deletedBy', 
                    'deletedAt'
                ]);
                paymentData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'Payment registered successfully.',
                    PaymentInfo: formatPayment
                  };
              }
            return paymentData;
        }
        catch (error){
            const paymentData = {
                status: 400,
                errCode: 400,
                errMessage: 'Can not add new payment'
            };
            console.log(error)
            return paymentData;
        }
    }


    // get by id
    getById = async(idPay: string): Promise<PaymentData> =>{
      try {
        let paymentData: PaymentData;

        if (!ObjectId.isValid(idPay)) {
          paymentData = {
            status: 400,
            errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
            errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
          };
          logger.error('error id');
          return paymentData;
        }

        const payment = await managerPayment.getMongoRepository(Payments).findOne({
          where: {
            _id: new ObjectId(idPay),
            delFlg: 0
          }
        }); 
        if (payment) {
          
          paymentData = {
            status: 200,
            errCode: 200,
            errMessage: `Get tours successfully.`,
            PaymentInfo: payment || {},
            PaymentData: payment
          };
        } else {
          paymentData = {
            status: 400,
            errCode: 400,
            errMessage: `Not found`,
            PaymentInfo: payment || {}
          };
        }
        return paymentData;
      } catch (error) {
        const paymentData = {
          status: 500,
          errCode: 500,
          errMessage: 'Internal error'
        };
        console.log(error);
        return paymentData;
      }
  }


}
export default new PaymentService();