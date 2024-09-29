'use strict'
import { Router, Request, Response } from 'express';
import tourController from '../../controller/tours/tour.controller';
import userController from '../../controller/customers/user.controller';
import commonController from '../../controller/common/common.controller';

export const commonRoute = Router();
commonRoute.post('/verification-email', commonController.handleRequestOTP);
commonRoute.post('/confirm-otp-email', commonController.handleConfirmOTP);
