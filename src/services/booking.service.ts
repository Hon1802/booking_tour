'use strict';
import { AppDataSource } from '../databases/connectDatabase';
const managerBooking = AppDataSource.mongoManager;
import _ from 'lodash';
import { Bookings } from '../databases/models/entities/Booking';
import { ObjectId } from 'mongodb';
import { OrderStatus, PaymentStatus } from '../databases/models/entities/common';
import { sentAcceptMail } from '../helpers/sentAcceptMaill';
import { contentAcceptEmail, contentEmail } from './common/contentEmail';
import { IBookingData } from '../databases/interface/bookingInterface';
import { FindOptions } from 'typeorm';
import errorCodes from '../common/errorCode/errorCodes';
import { logger } from '../log';
import tourService from './tour.service';
import { BadRequestError } from './common/http_error';
import calculateRefundAmount from './common/refund';
import userService from './user.service';
import { Tour } from '../databases/models/entities/Tour';
export class BookingService {
  // Hàm tạo mới
  async createBooking(bookingData: Partial<Bookings>): Promise<Bookings> {
    const bookingRepository = managerBooking.getRepository(Bookings);
    const newBooking = bookingRepository.create(bookingData);
    return await bookingRepository.save(newBooking);
  }

    // Hàm cập nhật payment
    async updatePaymentBooking(id: string, statusUpdate: string): Promise<Bookings | null> {
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
      if (!Object.values(PaymentStatus).includes(statusUpdate as PaymentStatus)) {
        throw new Error('Invalid order status');
      }
      // Cập nhật trạng thái đơn hàng
      booking.paymentStatus = statusUpdate as PaymentStatus;
  
      return await bookingRepository.save(booking);
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
  // Hàm cập nhật status
  async updateStatus(id: string, statusUpdate: string): Promise<Bookings | null> {
    const bookingRepository = managerBooking.getMongoRepository(Bookings);
    const booking = await bookingRepository.findOne({
      where: {
        _id: new ObjectId(id),
        delFlg: 0
      }
    });
    if (!booking) {
      throw new BadRequestError(`Booking not found with id : ${id}`);
    }
    if (!Object.values(OrderStatus).includes(statusUpdate as OrderStatus)) {
      throw new BadRequestError(`Invalid order status : ${statusUpdate}`);
    }
    // Cập nhật trạng thái đơn hàng
    booking.orderStatus = statusUpdate as OrderStatus;

    return await bookingRepository.save(booking);
  }
  // Hàm get list deposit users
  async getDepositUserBooking(
    idTour: string,
    perPage: number | null = null,
    currentPage: number = 1
  ): Promise<IBookingData> {
    try {
      let bookingData: IBookingData;

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
      if (!tourExist) {
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
        where: query
      });

      // Retrieve transport data with pagination and filters
      const bookings = await managerBooking.getMongoRepository(Bookings).find({
        where: query,
        take: perPage || 10,
        skip: skip
      });
      if (bookings.length > 0) {
        const bookingsSummary = bookings.map((booking) => ({
          name: booking.fullName || 'no name',
          phone: booking.phone || 'no phone',
          email: booking.email || 'no email',
          paymentStatus: booking.paymentStatus || 'no status',
          adultTicket: booking.adults.length || 0,
          childTicket: booking.children.length || 0,
          lastPaymentDate: booking.createdAt || Date.now()
        }));

        bookingData = {
          status: 200,
          errCode: 200,
          errMessage: `Get bookings successfully.`,
          userDepositArray: bookingsSummary, // Trả về danh sách khách sạn
          total: total.length || 0, // Tổng số lượng bản ghi
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
    } catch (error) {
      const transportData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.log(error);
      return transportData;
    }
  }

  // Hàm get list booking
  async getListBooking(
    idTour?: string,
    perPage: number | null = null,
    currentPage: number = 1,
    paymentStatus?: string,
    orderStatus?: string,
    method?: string
  ): Promise<IBookingData> {
    try {
      let bookingData: IBookingData;
      if (idTour && !ObjectId.isValid(idTour)) {
        bookingData = {
          status: 400,
          errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
          errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
        };
        logger.error('error id');
        return bookingData;
      }
      if (idTour) {
        const tourExist = await tourService.checkTour(idTour);
        if (!tourExist) {
          bookingData = {
            status: 400,
            errCode: errorCodes.RESPONSE.TOUR_NOT_FOUND.code,
            errMessage: errorCodes.RESPONSE.TOUR_NOT_FOUND.errMessage
          };
          logger.error('Tour not found');
          return bookingData;
        }
      }

      const options: FindOptions = {};

      if (perPage) {
        options.limit = perPage;
        options.skip = (currentPage - 1) * perPage;
      }
      const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);

      const query: any = {};
      if (idTour) {
        query.tourId = { $regex: idTour, $options: 'i' };
      }
      if (paymentStatus) {
        query.paymentStatus = { $regex: paymentStatus, $options: 'i' };
      }
      if (orderStatus) {
        query.orderStatus = orderStatus;
      }
      if (method) {
        query.method = { $regex: method, $options: 'i' };
      }
      query.delFlg = { $ne: 1 };
      
      const total = await managerBooking.getMongoRepository(Bookings).find({
        where: query
      });

      // count totalAmount with condition orderStatus === "COMPLETED"
      const sumTotalAmount = total.reduce((sum, booking) => {
        if (booking.orderStatus === 'COMPLETED') {
            return sum + (booking.totalAmount || 0); // Cộng dồn totalAmount, mặc định 0 nếu không có
        }
        return sum; // Bỏ qua nếu không phải COMPLETED
      }, 0);

      // Retrieve transport data with pagination and filters
      const bookings = await managerBooking.getMongoRepository(Bookings).find({
        where: query,
        take: perPage || 10,
        skip: skip
      });
      if (bookings.length > 0) {

        bookingData = {
          status: 200,
          errCode: 200,
          errMessage: `Get bookings successfully.`,
          userDepositArray: bookings, // Trả về danh sách khách sạn
          total: total.length || 0, // Tổng số lượng bản ghi
          currentPage: currentPage, // Trang hiện tại
          perPage: perPage || 10, // Số bản ghi mỗi trang (hoặc tất cả nếu không có perPage)
          totalRevenue: sumTotalAmount || 0,
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
    } catch (error) {
      const transportData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.log(error);
      return transportData;
    }
  }

   // Hàm get list booking by id user
   async getListBookingById(
    idUser?: string,
    perPage: number | null = null,
    currentPage: number = 1,
  ): Promise<IBookingData> {
    try {
      let bookingData: IBookingData;
      if (idUser && !ObjectId.isValid(idUser)) {
        bookingData = {
          status: 400,
          errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
          errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
        };
        logger.error('error id');
        return bookingData;
      }
      if (idUser) {
        const userExist = await userService.checkUser(idUser);
        if (!userExist) {
          bookingData = {
            status: 400,
            errCode: 'USER_001',
            errMessage: 'Not found user'
          };
          logger.error('User not found');
          return bookingData;
        }
      }

      const options: FindOptions = {};

      if (perPage) {
        options.limit = perPage;
        options.skip = (currentPage - 1) * perPage;
      }
      const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);

      const query: any = {};
      if (idUser) {
        query.userId = { $regex: idUser, $options: 'i' };
      }
  
      query.delFlg = { $ne: 1 };
      
      const total = await managerBooking.getMongoRepository(Bookings).find({
        where: query
      });


      // Retrieve transport data with pagination and filters
      const bookings = await managerBooking.getMongoRepository(Bookings).find({
        where: query,
        take: perPage || 10,
        skip: skip
      });
      if (bookings.length > 0) {
        const bookingsSummary = await Promise.all(bookings.map(async (booking) => {
          // Lấy thông tin tour cho mỗi booking
          const tour = await tourService.getTourById(booking.tourId); // Lấy thông tin tour từ tourId
          let tourData: Tour | any ;
          if(tour)
          {

            tourData = tour.tourInfor;
          }
          return {
            id: booking.id,
            tourName: tourData.name || 'no name', // Sử dụng tên tour lấy được
            totalPrice: booking.totalAmount || 0,
            estimateDate: tourData.estimatedTime, // Có thể thay đổi tùy vào cách lấy estimateDate
            image: tourData.images, // Nếu có ảnh, bạn có thể thêm logic để lấy ảnh ở đây
            adultTicket: booking.adults.length || 0,
            childTicket: booking.children.length || 0,
            paymentStatus: booking.paymentStatus || 'no status',
            orderStatus: booking.orderStatus
          };
        }));
        bookingData = {
          status: 200,
          errCode: 200,
          errMessage: `Get bookings successfully.`,
          userDepositArray: bookingsSummary, // Trả về danh sách khách sạn
          total: total.length || 0, // Tổng số lượng bản ghi
          currentPage: currentPage, // Trang hiện tại
          perPage: perPage || 10, // Số bản ghi mỗi trang (hoặc tất cả nếu không có perPage)
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
    } catch (error) {
      const transportData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.log(error);
      return transportData;
    }
  }
 // Hàm get detail booking by id 
 async getDetailBookingById(bookingId?: string): Promise<IBookingData> {
  try {
    let bookingData: IBookingData;
    const bookingRepository = managerBooking.getMongoRepository(Bookings);
    
    // Kiểm tra tính hợp lệ của bookingId
    if (bookingId && !ObjectId.isValid(bookingId)) {
      return {
        status: 400,
        errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
        errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
      };
    }

    if (bookingId) {
      // Tìm booking trong DB
      const booking = await bookingRepository.findOne({
        where: {
          _id: new ObjectId(bookingId),
          delFlg: 0
        }
      });

      // Nếu không tìm thấy booking
      if (!booking) {
        logger.error('Booking not found');
        return {
          status: 400,
          errCode: 'USER_001',
          errMessage: 'Not found booking'
        };
      }

      // Lấy thông tin tour từ tourId
      const tour = await tourService.getTourById(booking.tourId);
      let tourData: Tour | any;

      if (tour) {
        tourData = tour.tourInfor;
      }
      // console.log(tourData);
      // Xây dựng dữ liệu trả về
      const dataReturn = {
        id: booking.id,
        tourName: tourData.name || 'no name',
        totalAmount: booking.totalAmount || 0,
        depositAmount: booking.depositAmount || 0,
        estimateDate: tourData.estimatedTime || 'no estimate date',
        duration: tourData.duration,
        ticketAdult: booking.adults.length || 0,
        ticketChild: booking.children.length || 0,
        adultPrice: tourData.priceAdult||0,
        childPrice: tourData.priceChild || 0,
        paymentId: booking.paymentId,
        method: booking.method,
        payerName: booking.payerName,
        createAt: booking.createdAt,
        image: tourData.images || '',
        paymentStatus: booking.paymentStatus || 'no status',
        orderStatus: booking.orderStatus
      };

      return {
        status: 200,
        errCode: 200,
        errMessage: 'Get booking details successfully.',
        bookingInfo: dataReturn
      };
    } else {
      // Trường hợp không có bookingId
      return {
        status: 400,
        errCode: 'USER_001',
        errMessage: 'Not found booking'
      };
    }
  } catch (error) {
    logger.error('Internal error: ' + error);
    return {
      status: 500,
      errCode: 500,
      errMessage: 'Internal error'
    };
  }
}

  // Hàm get list booking
  async getListBookingRefund(
    idTour?: string,
    perPage: number | null = null,
    currentPage: number = 1,
    paymentStatus?: string,
    method?: string
  ): Promise<IBookingData> {
    try {
      let bookingData: IBookingData;

      if (idTour && !ObjectId.isValid(idTour)) {
        bookingData = {
          status: 400,
          errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
          errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
        };
        logger.error('error id');
        return bookingData;
      }
      let dateStart: Date | null = null;
      if (idTour) {
        const tourExist = await tourService.checkTour(idTour);
        if (tourExist && typeof tourExist !== "boolean") {
          if (tourExist.estimatedTime && tourExist.estimatedTime instanceof Date) {
              dateStart = tourExist.estimatedTime;
          } else {
              logger.error('Estimated time is not a valid Date');
              return {
                  status: 400,
                  errCode: 400,
                  errMessage: "Estimated time is not a valid Date",
              };
          }
      } else {
          bookingData = {
              status: 400,
              errCode: errorCodes.RESPONSE.TOUR_NOT_FOUND.code,
              errMessage: errorCodes.RESPONSE.TOUR_NOT_FOUND.errMessage,
          };
          logger.error('Tour not found');
          return bookingData;
      }
      }
      console.log('dateStart', dateStart)
      const options: FindOptions = {};

      if (perPage) {
        options.limit = perPage;
        options.skip = (currentPage - 1) * perPage;
      }
      const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);

      const query: any = {};
      if (idTour) {
        query.tourId = { $regex: idTour, $options: 'i' };
      }
      if (paymentStatus) {
        query.paymentStatus = { $regex: paymentStatus, $options: 'i' };
      }
      
      query.orderStatus = { $in: ['CANCELLED_BY_ADMIN', 'REFUND_COMPLETED','CANCELLED'] };

      if (method) {
        query.method = { $regex: method, $options: 'i' };
      }
      const total = await managerBooking.getMongoRepository(Bookings).find({
        where: query
      });

 
      // Retrieve transport data with pagination and filters
      const bookings = await managerBooking.getMongoRepository(Bookings).find({
        where: query,
        take: perPage || 10,
        skip: skip
      });
      if (bookings.length > 0) {

        const bookingsSummary = bookings.map((booking) => ({
          idOder: booking.id,
          paymentId: booking.paymentId,
          fullName: booking.fullName || 'no name',
          payerName: booking.payerName || 'no name',
          phone: booking.phone || 'no phone',
          email: booking.email || 'no email',
          paymentStatus: booking.paymentStatus || 'no status',
          orderStatus: booking.orderStatus || 'no status',
          paymentAccount: booking.paymentAccount || 0,
          depositAmount: booking.depositAmount || 0,
          status: booking.orderStatus || '',
          refundAmount: calculateRefundAmount({
            depositAmount: booking.depositAmount,
            totalAmount: booking.totalAmount,
            departureDate: dateStart || new Date(),
            status: booking.orderStatus,
            cancelDate: new Date()
          }
          )
        }));

        bookingData = {
          status: 200,
          errCode: 200,
          errMessage: `Get bookings successfully.`,
          userDepositArray: bookingsSummary, // Trả về danh sách khách sạn
          total: total.length || 0, // Tổng số lượng bản ghi
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
    } catch (error) {
      const transportData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.log(error);
      return transportData;
    }
  }

  // Hàm xóa (soft delete)
  async deleteBooking(id: string): Promise<void> {
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
    booking.delFlg = 1;
    booking.deletedAt = new Date();
    await bookingRepository.save(booking);
  }
  
  // get by id
  async getBookingById(id: string): Promise<Bookings> {

    const bookingRepository = managerBooking.getMongoRepository(Bookings);
    const booking = await bookingRepository.findOne({
      where: {
        _id: new ObjectId(id),
        delFlg: 0
      }
    });
    if (!booking) {
      throw new BadRequestError('Booking not found');
    }
    return booking;
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
      try {
        const contentToEmail = contentAcceptEmail(item?.fullName, item?.tourId, item?.createdAt);
        await sentAcceptMail('soihoang1802@gmail.com', item?.email, contentToEmail, 'Accept require tour');
      } catch (error) {
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
      try {
        const contentToEmail = contentEmail(item?.fullName, item?.tourId, item?.createdAt);
        await sentAcceptMail('soihoang1802@gmail.com', item?.email, contentToEmail, 'Cancel require tour');
      } catch (error) {
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
  async checkBooking(id: string): Promise<boolean> {
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
