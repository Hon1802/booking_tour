'use strict'
import express from 'express';
import { userRoute } from './userRoute';
import { adminRoute } from './adminRoute';
import { customerRoute } from './customerRoute';

export const routes = express.Router();

routes.use('/api/customer', customerRoute);
routes.use('/api/user', userRoute);
routes.use('/api/admin', adminRoute);

// routes.use('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
//     res.send('Wellcome to BE Typescript');
//   }
// )
