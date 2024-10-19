'use strict'
import { Router } from 'express';
import adminController from '../../controller/admins/admin.controller';
import tourController from '../../controller/tours/tour.controller';
export const adminRoute = Router();

adminRoute.post('/new-tour', adminController.handleAddNewTour);

adminRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);

adminRoute.get('/get-tour-by-id', tourController.handleGetTourById);

adminRoute.patch('/update-tour-status', adminController.handleUpdateStatusTour);

adminRoute.patch('/update-tour-by-id', adminController.handleUpdateTourById);

adminRoute.patch('/upload-image', adminController.handleUpdateImageTour);

adminRoute.patch('/new-image', adminController.handleNewImageTour);

adminRoute.patch('/upload-image-remove', adminController.handleRemoveImageTour);

adminRoute.get('/tours/filter', adminController.handleFilterStatusTour);


