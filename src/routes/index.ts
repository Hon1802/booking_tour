'use strict'
import express from 'express';
import { userRoute } from './userRoute';
import { adminRoute } from './adminRoute';
import { customerRoute } from './customerRoute';
import { accessRouter } from './access';

export const routes = express.Router();
// for access as login, logout 
routes.use('/v1/api',accessRouter );
// for customer
routes.use('/api/customer', customerRoute);
// for user
routes.use('/api/user', userRoute);
// for admin
routes.use('/api/admin', adminRoute);

// routes.use('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
//     res.send('Wellcome to BE Typescript');
//   }
// )
