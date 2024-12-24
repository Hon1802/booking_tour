'use strict';
import { Between } from 'typeorm';
import currentConfig from '../config';
import { IDataStatic } from '../databases/interface/bookingInterface';
import RedisConnection from '../databases/redis/redis.init';
import { sentOTPMail } from '../helpers/sentEmail';
import { ResponseData } from './common/interface';
import { generateOTP } from './common/util';
import userService from './user.service';
import { AppDataSource } from '../databases/connectDatabase';
import { Bookings } from '../databases/models/entities/Booking';

// some const
const from_email = currentConfig.app.from_email;
const secret_email = currentConfig.app.secret_email;

class CommonService {
  requestOTP = async (email: string, ttl: number = 5 * 60): Promise<ResponseData> => {
    try {
      // step 1: check email exist ??
      let responseData: ResponseData;
      let redis_name = 'OTP' + email;
      // let can_edit_email = 'EDIT'+email;

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

      const checkRedis = await redis.getValue(redis_name);
      if (checkRedis.value) {
        responseData = {
          status: 400,
          errCode: 400,
          errMessage: `OTP has been sent. Please try again in ${checkRedis.ttl} seconds`
        };
        return responseData;
      }
      await redis.setValue(redis_name, newOTP, ttl);
      // sent
      sentOTPMail(from_email, email, secret_email, newOTP, 'Confirm OTP in 5 minutes');
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
  requestOTPExist = async (email: string, ttl: number = 5 * 60): Promise<ResponseData> => {
    try {
      // step 1: check email exist ??
      let responseData: ResponseData;
      let redis_name = 'OTP' + email;
      // let can_edit_email = 'EDIT'+email;
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

      const checkRedis = await redis.getValue(redis_name);
      if (checkRedis.value) {
        responseData = {
          status: 400,
          errCode: 400,
          errMessage: `OTP has been sent. Please try again in ${checkRedis.ttl} seconds`
        };
        return responseData;
      }
      await redis.setValue(redis_name, newOTP, ttl);
      // await redis.setValue(can_edit_email, email, ttl);
      // sent
      sentOTPMail(from_email, email, secret_email, newOTP, 'Confirm OTP in 5 minutes');
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
      let can_edit_email = 'EDIT' + email;
      // const emailExists = await userService.checkEmailExist(email);

      // if (!emailExists) {
      //     responseData = {
      //         status: 400,
      //         errCode: 400,
      //         errMessage: `${email} is not exist `
      //       };
      //       return responseData;
      // }

      // generate new OTP
      const redis = RedisConnection.getInstance();

      const checkRedis = await redis.getValue(redis_name);
      if (!checkRedis.value) {
        responseData = {
          status: 400,
          errCode: 400,
          errMessage: `OTP has invalid`
        };
        return responseData;
      }
      const confirmOTP = checkRedis?.value?.toString().trim() === code.toString().trim();
      if (confirmOTP) {
        await redis.deleteValue(redis_name);
        const ttl: number = 5 * 60;
        await redis.setValue(can_edit_email, email, ttl);

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

  // statisticsData

  statisticsTour = async (fromDay: Date, toDay: Date): Promise<IDataStatic> => {
    try {
      // step 1: check email exist ??
      let responseData: IDataStatic;

      // const emailExists = await userService.checkEmailExist(email);
      // if (!emailExists) {
      //     responseData = {
      //         status: 400,
      //         errCode: 400,
      //         errMessage: `${email} is not exist `
      //       };
      //       return responseData;
      // }
      const managerBooking = AppDataSource.mongoManager;
      const query: any = {
        createdAt: { $gte: fromDay, $lte: toDay } // Lọc theo thời gian
      };

      const total: any = await managerBooking
        .getMongoRepository(Bookings)
        .aggregate([
          { $match: query }, // Áp dụng điều kiện
          { $count: 'total' } // Đếm số lượng
        ])
        .toArray();

      const totalCount = total.length > 0 ? total[0].total : 0;

      const statusCounts = await managerBooking
        .getMongoRepository(Bookings)
        .aggregate([
          {
            $match: {
              createdAt: { $gte: fromDay, $lte: toDay } // Lọc theo thời gian
            }
          },
          {
            $group: {
              _id: '$orderStatus', // Nhóm theo OrderStatus
              count: { $sum: 1 } // Đếm số lượng
            }
          }
        ])
        .toArray();

      responseData = {
        status: 200,
        errCode: 200,
        errMessage: {
          total: totalCount,
          dataOrder: statusCounts
        }
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
  statisticsTourFomatLine = async (fromDay: Date, toDay: Date): Promise<IDataStatic> => {
    try {
      // step 1: check email exist ??
      let responseData: IDataStatic;

      const managerBooking = AppDataSource.mongoManager;
      const query: any = {
        createdAt: { $gte: fromDay, $lte: toDay } // Lọc theo thời gian
      };

      const total: any = await managerBooking
        .getMongoRepository(Bookings)
        .aggregate([
          { $match: query }, // Áp dụng điều kiện
          { $count: 'total' } // Đếm số lượng
        ])
        .toArray();

      const totalCount = total.length > 0 ? total[0].total : 0;

      const statusCounts = await managerBooking
        .getMongoRepository(Bookings)
        .aggregate([
          {
            $match: {
              createdAt: { $gte: fromDay, $lte: toDay } // Lọc theo thời gian
            }
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              dailyDeposit: { $sum: "$depositAmount" }, // Tổng depositAmount trong ngày
              dailyTotal: { $sum: "$totalAmount" },    // Tổng totalAmount trong ngày
            }
          }, 
          {
            $group: {
              _id: { month: "$_id.month", year: "$_id.year" },
              monthlyDeposit: { $sum: "$dailyDeposit" }, // Tổng depositAmount trong tháng
              monthlyTotal: { $sum: "$dailyTotal" },    // Tổng totalAmount trong tháng
              dailyData: { $push: { day: "$_id.day", dailyDeposit: "$dailyDeposit", dailyTotal: "$dailyTotal" } },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 }, // Sắp xếp theo năm, tháng
          },
        ])
        .toArray();

      responseData = {
        status: 200,
        errCode: 200,
        errMessage: {
          total: totalCount,
          dataOrder: statusCounts
        }
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
}
export default new CommonService();
