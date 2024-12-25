import { NextFunction, Request, Response } from 'express';
import { PaymentData } from "../../databases/interface/paymentInterface";
import paymentService from "../../services/payment.service";

class PaymentController {
  // add new payment, public

  handleAddNewPayment = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const data = req.body;
       
        const paymentData: PaymentData = await paymentService.payment(data);
       
        return res.status(paymentData.status).json({
            errCode: paymentData.errCode,
            message: paymentData.errMessage,
            data: paymentData.PaymentInfo || 'null',
            });
    } catch(error){
        next(error)
    }
  }
}

export default new PaymentController();
