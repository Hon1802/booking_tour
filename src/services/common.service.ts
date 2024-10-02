'use strict'
import currentConfig from '../config';
import RedisConnection from '../databases/redis/redis.init';
import { sentOTPMail } from '../helpers/sentEmail';
import { ResponseData } from './common/interface';
import { generateOTP } from './common/util';
import userService from './user.service';

// some const
const from_email = currentConfig.app.from_email;
const secret_email = currentConfig.app.secret_email;

class CommonService{

    requestOTP = async (email: string, ttl: number = 5*60): Promise<ResponseData> => {
        try {
          // step 1: check email exist ??
          let responseData: ResponseData;
          let redis_name = 'OTP' + email;
          let can_edit_email = 'EDIT'+email;

          const emailExists = await userService.checkEmailExist(email); 

            if (!emailExists) {
                responseData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `${email} is not exist `
                  };
                  return responseData;
            }

          // generate new OTP
          const newOTP = generateOTP();
          const redis = RedisConnection.getInstance();

          const checkRedis = await redis.getValue(redis_name)
          if(checkRedis.value){
            responseData = {
                status: 400,
                errCode: 400,
                errMessage: `OTP has been sent. Please try again in ${checkRedis.ttl} seconds`
              };
            return responseData;
          }
          await redis.setValue(redis_name, newOTP , ttl);
          await redis.setValue(can_edit_email, email, ttl);
          // sent
          sentOTPMail(
            from_email,
            email,
            secret_email,
            newOTP,
            'Confirm OTP in 5 minutes'
          );    
          responseData = {
            status: 200,
            errCode: 200,
            ttl: `${ttl}`,
            errMessage: `OTP sender to ${email} `
          };
          return responseData;
        } catch (error) {
          // Type-asserting error to be of type Error
          const responseData = {
            status: 500,
            errCode: 500,
            errMessage: 'Internal error'
          };
          return responseData;
        }
      };
    requestOTPExist = async (email: string, ttl: number = 5*60): Promise<ResponseData> => {
        try {
          // step 1: check email exist ??
          let responseData: ResponseData;
          let redis_name = 'OTP' + email;
          let can_edit_email = 'EDIT'+email;
          const emailExists = await userService.checkEmailExist(email); 

          if (emailExists) {
              responseData = {
                  status: 409,
                  errCode: 409,
                  errMessage: `${email} existed `
                };
                return responseData;
          }

          // generate new OTP
          const newOTP = generateOTP();
          const redis = RedisConnection.getInstance();

          const checkRedis = await redis.getValue(redis_name)
          if(checkRedis.value){
            responseData = {
                status: 400,
                errCode: 400,
                errMessage: `OTP has been sent. Please try again in ${checkRedis.ttl} seconds`
              };
            return responseData;
          }
          await redis.setValue(redis_name, newOTP , ttl);
          await redis.setValue(can_edit_email, email, ttl);
          // sent
          sentOTPMail(
            from_email,
            email,
            secret_email,
            newOTP,
            'Confirm OTP in 5 minutes'
          );    
          responseData = {
            status: 200,
            errCode: 200,
            ttl: `${ttl}`,
            errMessage: `OTP sender to ${email} `
          };
          return responseData;
        } catch (error) {
          // Type-asserting error to be of type Error
          const responseData = {
            status: 500,
            errCode: 500,
            errMessage: 'Internal error'
          };
          return responseData;
        }
      };
    confirmOTP = async (email: string, code: string): Promise<ResponseData> => {
        try {
          // step 1: check email exist ??
          let responseData: ResponseData;
          let redis_name = 'OTP' + email;
          const emailExists = await userService.checkEmailExist(email); 

            if (!emailExists) {
                responseData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `${email} is not exist `
                  };
                  return responseData;
            }

          // generate new OTP
          const redis = RedisConnection.getInstance();

          const checkRedis = await redis.getValue(redis_name)
          if(!checkRedis.value){
            responseData = {
                status: 400,
                errCode: 400,
                errMessage: `OTP has invalid`
              };
            return responseData;
          }
          const confirmOTP = checkRedis?.value?.toString().trim() === code.toString().trim();
          if(confirmOTP){
                await redis.deleteValue(redis_name)
              responseData = {
                status: 200,
                errCode: 200,
                errMessage: `OTP verified`
              };
              return responseData;
          } else {
            responseData = {
                status: 400,
                errCode: 400,
                errMessage: `OTP wrong`
              };
            return responseData;
          }
        } catch (error) {
          // Type-asserting error to be of type Error
          const responseData = {
            status: 500,
            errCode: 500,
            errMessage: 'Internal error'
          };
          return responseData;
        }
      };

}
export default new CommonService();