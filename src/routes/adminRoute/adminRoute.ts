'use strict'
import { Router } from 'express';
import adminController from '../../controller/admins/admin.controller';
import tourController from '../../controller/tours/tour.controller';
export const adminRoute = Router();

adminRoute.post('/new-tour', adminController.handleAddNewTour);

adminRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);

adminRoute.get('/get-tour-by-id', tourController.handleGetTourById);

adminRoute.post('/update-tour-status', adminController.handlUpdateStatusTour);

