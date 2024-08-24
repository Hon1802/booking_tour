'use strict'
import { Router } from 'express';
import accessController from '../../controller/access/access.controller';
export const accessRouter = Router();

// accessRouter.post('/test/sign-up', accessController.signUp);
// register
accessRouter.post('/sign-up', accessController.handleRegister);
accessRouter.post('/sign-in', accessController.handleSignIn);
accessRouter.post('/log-out', accessController.handlelogOut);
accessRouter.post('/forgot-password', accessController.handleForgotPassword);




