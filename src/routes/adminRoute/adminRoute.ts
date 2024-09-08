'use strict'
import { Router } from 'express';
import adminController from '../../controller/admins/admin.controller';
export const adminRoute = Router();

adminRoute.post('/new-tour', adminController.handleAddNewTour);

adminRoute.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send('Express2 + TypeScript Server');
});
adminRoute.get('/*', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send('No support for API');
});
