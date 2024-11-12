'use strict'
import { Router, Request, Response } from 'express';
import tourController from '../../controller/tours/tour.controller';
import userController from '../../controller/customers/user.controller';
import { BookingController } from '../../controller/bookings/booking.controller';
const bookingController = new BookingController();
export const customerRoute = Router();
// Tour routes
customerRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);
customerRoute.get('/get-tour-by-id', tourController.handleGetTourById);

customerRoute.get('/hot-tours', tourController.handleGetHotTour);
customerRoute.get('/latest-tours', tourController.handleGetLastedTour);
customerRoute.get('/tours/filter', tourController.handleFilterTour);
// User routes
// get by id
customerRoute.get('/get-user-by-id', userController.handleGetUserById);

// update image of user
customerRoute.patch('/upload-avatar', userController.handleUpdateImageUser);

// update information user by id
customerRoute.put('/update-user-by-id', userController.handleUpdateUserById);

// change status
customerRoute.delete('/delete-account', userController.handleUpdateStatusUser);

// update password of user
customerRoute.patch('/update-password', userController.handleUpdatePassword);


// booking

customerRoute.post('/bookings', bookingController.handleAddNewBooking);
customerRoute.put('/bookings/status', bookingController.handleUpdateBooking);