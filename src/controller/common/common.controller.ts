'use strict'
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../log';
import currentConfig from '../../config';
import commonService from '../../services/common.service';

class CommonController {
    handleRequestOTP = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            logger.info(`[P]::request Otp:: email : `);
            const { email } = req.body;
            if(!email ){
                return res.status(400).json({
                    errCode: 400,
                    message: 'Missing inputs value'
                  });
            }
            const sentOTP = await commonService.requestOTP(email)
            return res.status(sentOTP.status).json({
                errCode: sentOTP.errCode,
                message: sentOTP.errMessage,
                ttl: sentOTP.ttl
              });
        } catch(error){
            // next(error)
            console.error(`Error handling request: ${error}`);
            return res.status(500).json({
              errCode: 500,
              message: 'Server error .',
            });
        }
    }
    handleConfirmOTP = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            logger.info(`[P]::confirm Otp:: email : `);
            const { email, code } = req.body;
            if(!email && !code ){
                return res.status(400).json({
                    errCode: 400,
                    message: 'Missing inputs value'
                  });
            }
            const sentOTP = await commonService.confirmOTP(email, code)
            return res.status(sentOTP.status).json({
                errCode: sentOTP.errCode,
                message: sentOTP.errMessage,
              });
        } catch(error){
            // next(error)
            console.error(`Error handling request: ${error}`);
            return res.status(500).json({
              errCode: 500,
              message: 'Server error .',
            });
        }
    }
}
export default new CommonController();