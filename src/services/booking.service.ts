'use strict'
import { AppDataSource } from '../databases/connectDatabase';
const managerBooking = AppDataSource.mongoManager;
import _ from 'lodash';
import { Bookings } from '../databases/models/entities/Booking';
import { ObjectId } from 'mongodb';
import { OrderStatus } from '../databases/models/entities/common';
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
      item.orderStatus = OrderStatus.COMPLETED;
      item.acceptFlg = 1;
      // Save the updated item to the database
      await bookingRepository.save(item); 
  }

    return true;
  }
}
