'use strict'
import { AppDataSource } from '../databases/connectDatabase';
const managerBooking = AppDataSource.mongoManager;
import _ from 'lodash';
import { Bookings } from '../databases/models/entities/Booking';
import { ObjectId } from 'mongodb';
import { OrderStatus } from '../databases/models/entities/common';
import { sentAcceptMail } from '../helpers/sentAcceptMaill';
import { contentAcceptEmail, contentEmail } from './common/contentEmail';
import { IBookingData } from '../databases/interface/bookingInterface';
import { FindOptions } from 'typeorm';
import errorCodes from '../common/errorCode/errorCodes';
import { logger } from '../log';
import tourService from './tour.service';
export class BookingService {

  // Hàm tạo mới
  async createBooking(bookingData: Partial<Bookings>): Promise<Bookings> {
    const bookingRepository = managerBooking.getRepository(Bookings);
    const newBooking = bookingRepository.create(bookingData);
    return await bookingRepository.save(newBooking);
  }

  // Hàm cập nhật
  async updateBooking(id: string, statusUpdate: string): Promise<Bookings | null> {
    const bookingRepository = managerBooking.getMongoRepository(Bookings);
    const booking = await bookingRepository.findOne({
        where: { 
            _id: new ObjectId(id),
            delFlg: 0
         }
    });
    if (!booking) {
      throw new Error('Booking not found');
    }
    if (!Object.values(OrderStatus).includes(statusUpdate as OrderStatus)) {
        throw new Error('Invalid order status');
      }
    // Cập nhật trạng thái đơn hàng
    booking.orderStatus = statusUpdate as OrderStatus;

    return await bookingRepository.save(booking);
  }

  
  // Hàm get list deposit users
  async getDepositUserBooking(idTour: string ,perPage: number | null = null , currentPage: number = 1): Promise<IBookingData> {
    try{
      let bookingData : IBookingData;

      
      if (!ObjectId.isValid(idTour)) {
          bookingData = {
              status: 400,
              errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
              errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
          };
          logger.error('error id');
          return bookingData;
      }

      const tourExist = await tourService.checkTour(idTour);
      if( !tourExist)
      {
          bookingData = {
            status: 400,
            errCode: errorCodes.RESPONSE.TOUR_NOT_FOUND.code,
            errMessage: errorCodes.RESPONSE.TOUR_NOT_FOUND.errMessage
        };
        logger.error('Tour not found');
        return bookingData;
      }

      const options: FindOptions = {};



      if (perPage) {
          options.limit = perPage;
          options.skip = (currentPage - 1) * perPage; 
      }
      const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);

      const query: any = {};
      query.tourId = { $regex: idTour, $options: 'i' };

      const total = await managerBooking.getMongoRepository(Bookings).find({
        where: query,
      });
     
      // Retrieve transport data with pagination and filters
      const bookings = await managerBooking.getMongoRepository(Bookings).find({
        where: query,
        take: perPage || 10,
        skip: skip,
      });
        if (bookings.length > 0) {

          const bookingsSummary = bookings.map(booking => ({
            name: booking.fullName || 'no name', 
            phone: booking.phone || 'no phone',
            email: booking.email || 'no email',
            paymentStatus: booking.paymentStatus || 'no status',
            adultTicket: booking.adults.length || 0, 
            childTicket: booking.children.length || 0, 
            lastPaymentDate: booking.createdAt || Date.now(), 
          }));
          

          bookingData = {
              status: 200,
              errCode: 200,
              errMessage: `Get transports successfully.`,
              userDepositArray: bookingsSummary, // Trả về danh sách khách sạn
              total: total.length || 0,      // Tổng số lượng bản ghi
              currentPage: currentPage, // Trang hiện tại
              perPage: perPage || 10 // Số bản ghi mỗi trang (hoặc tất cả nếu không có perPage)
          };
      } else {
          bookingData = {
              status: 400,
              errCode: 400,
              errMessage: `Not found`,
              bookingArray: [] // Không tìm thấy khách sạn
          };
      }

      return bookingData;
    } catch(error)
      {
        const transportData = {
          status: 500,
          errCode: 500,
          errMessage: 'Internal error'
      };
      console.log(error)
      return transportData;
    }
  }

  // Hàm xóa (soft delete)
  async deleteBooking(id: string): Promise<void> {
    const bookingRepository = managerBooking.getRepository(Bookings);
    const booking = await bookingRepository.findOne({
        where: { 
            id: new ObjectId(id),
            delFlg: 0
         }
    });
    if (!booking) {
      throw new Error('Booking not found');
    }
    booking.deletedAt = new Date();
    await bookingRepository.save(booking);
  }
    
  // change all booking with tour id

   // Hàm cập nhật
   async acceptBooking(idTour: string): Promise<boolean> {
    const bookingRepository = managerBooking.getMongoRepository(Bookings);
    const bookings = await bookingRepository.find({
        where: { 
          tourId: idTour,
          acceptFlg: { $ne: 1 }
         }
    });
    if (!bookings) {
      console.log('Booking not found');
      return false;
    }
    for (const item of bookings) {
      console.log(item.fullName);
      try{
        const contentToEmail = contentAcceptEmail(item?.fullName, item?.tourId, item?.createdAt);
        await sentAcceptMail('soihoang1802@gmail.com', item?.email , contentToEmail, 'Accept require tour');
      } catch(error)
      {
        console.log('error sent email :', item?.email);
      }
      item.orderStatus = OrderStatus.COMPLETED;
      item.acceptFlg = 1;
      // Save the updated item to the database
      await bookingRepository.save(item); 
  }

    return true;
  }

   // Hàm cancel cập nhật
   async cancelBooking(idTour: string): Promise<boolean> {
    const bookingRepository = managerBooking.getMongoRepository(Bookings);
    const bookings = await bookingRepository.find({
        where: { 
          tourId: idTour,
          acceptFlg: { $ne: 1 }
         }
    });
    if (!bookings) {
      console.log('Booking not found');
      return false;
    }
    for (const item of bookings) {
      console.log(item.fullName);
      try{
        const contentToEmail = contentEmail(item?.fullName, item?.tourId, item?.createdAt);
        await sentAcceptMail('soihoang1802@gmail.com', item?.email , contentToEmail, 'Cancel require tour');
      } catch(error)
      {
        console.log('error sent email :', item?.email);
      }
      item.orderStatus = OrderStatus.CANCELLED_BY_ADMIN;
      item.acceptFlg = 0;
      // Save the updated item to the database
      await bookingRepository.save(item); 
  }

    return true;
  }

  // check exist
  // Hàm cập nhật
  async checkBooking(id: string): Promise< boolean > {
    const bookingRepository = managerBooking.getMongoRepository(Bookings);
    const booking = await bookingRepository.findOne({
        where: { 
            _id: new ObjectId(id),
            delFlg: 0
         }
    });
    if (booking) {
      return true;
    }
    return false;
  }
}
