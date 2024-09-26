'use strict'
import { Router, Request, Response } from 'express';
import tourController from '../../controller/tours/tour.controller';
import userController from '../../controller/customers/user.controller';

export const customerRoute = Router();
customerRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);
customerRoute.get('/get-tour-by-id', tourController.handleGetTourById);
// user information

customerRoute.patch('/upload-avatar', userController.handleUpdateImageUser);
customerRoute.delete('/delete-account', userController.handleUpdateStatusUser);

