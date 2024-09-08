'use strict'
import express from 'express';
import { adminRoute } from './adminRoute/adminRoute';
import { customerRoute } from './customerRoute';
import { accessRouter } from './access';

export const routes = express.Router();
// for access as login, logout 
routes.use('/v1/api',accessRouter );
// for customer
routes.use('/v1/api', customerRoute);
// for admin
routes.use('/v1/api/admin', adminRoute);
