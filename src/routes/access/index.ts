'use strict'
import { Router } from 'express';
import accessController from '../../controller/access/access.controller';
export const accessRouter = Router();
// register
accessRouter.post('/sign-up', accessController.handleRegister);
accessRouter.post('/sign-in', accessController.handleSignIn);
accessRouter.post('/log-out', accessController.handleLogOut);
accessRouter.post('/forgot-password', accessController.handleForgotPassword);




