'use strict'
import { Router, Request, Response } from 'express';
import tourController from '../../controller/tours/tour.controller';

export const customerRoute = Router();
customerRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);
customerRoute.get('/get-tour-by-id', tourController.handleGetTourById);
