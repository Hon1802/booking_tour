import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../../services/booking.service';
import { Bookings } from '../../databases/models/entities/Booking';
import { OrderStatus, PaymentStatus } from '../../databases/models/entities/common';
import userService from '../../services/user.service';
import tourService from '../../services/tour.service';
import paymentService from '../../services/payment.service';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  // Xử lý thêm mới một booking
  handleAddNewBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tourId, userId, information, paymentId } = req.body;

      if(!tourId || !userId || !information){
        return res.status(400).json({
            errCode: 400,
            message: 'Missing inputs value'
          });
        }

      const user = await userService.checkUser(userId);
      const tour = await tourService.checkTour(tourId);
      const payment = await paymentService.getById(paymentId);
      if(!user)
      {
        return res.status(400).json({
            errCode: 400,
            message: 'User not exist'
          });
      }
      if(!tour)
        {
          return res.status(400).json({
              errCode: 400,
              message: 'Tour not exist'
            });
        }

      const isTourApproved = await tourService.checkTourApprove(tourId); 
      let O_Status = OrderStatus.WAITING_CONFIRM;
      if(isTourApproved)
      {
        O_Status = OrderStatus.COMPLETED
      }

      const getEmail = await userService.getEmailById(userId);



      const newBookingData = {
          tourId: tourId,
          userId: userId,
          paymentId: paymentId || 'null',
          email: information?.email || getEmail,
          fullName: information?.fullName || 'null',
          phone: information?.phone || null,
          adults: information?.adults || [],
          children: information?.children || [],
          orderStatus: O_Status,
          paymentStatus: PaymentStatus.NEW_REQUEST,
          depositAmount: payment?.PaymentData?.depositAmount || 0,
          totalAmount: payment?.PaymentData?.totalAmount || 0,
          method: payment?.PaymentData?.paymentMethod || '' ,
          paymentAccount: payment?.PaymentData?.paymentAccount || '',
          payerName: payment?.PaymentData?.payerName || 'no name',
          updateOrderStatus: function (): void {
              throw new Error('Function not implemented.');
          },
          delFlg: 0,
      };

      const newBooking = await this.bookingService.createBooking(newBookingData);

      res.status(201).json({
        message: 'Booking created successfully',
        id: newBooking.id
      });
    } catch (error) {
      next(error);
    }
  };

  // Xử lý cập nhật một booking
  handleUpdateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookingId, orderStatus } = req.body;
      console.log(bookingId, ' : ',orderStatus)
      const updatedBooking = await this.bookingService.updateBooking(bookingId, orderStatus);
      if (!updatedBooking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }
      return res.status(200).json({
        errCode: 200,
        message: 'Update success',
        data: updatedBooking
      });
    } catch (error) {
      next(error);
    }
  };

  // Xử lý xóa một booking
  handleRemoveBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.bookingService.deleteBooking(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
