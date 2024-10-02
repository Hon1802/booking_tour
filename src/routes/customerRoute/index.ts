'use strict'
import { Router, Request, Response } from 'express';
import tourController from '../../controller/tours/tour.controller';
import userController from '../../controller/customers/user.controller';

export const customerRoute = Router();
// Tour routes
customerRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);
customerRoute.get('/get-tour-by-id', tourController.handleGetTourById);

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
