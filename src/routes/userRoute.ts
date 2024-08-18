import { Router, Request, Response } from 'express';
import { handleGetUserById } from '../controller/users';

export const userRoute = Router();
userRoute.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send('Api for user');
});
userRoute.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send('Express2 + TypeScript Server');
});

// get information user by id
userRoute.get('/get-user-by-id', async (req: Request, res: Response) => {
  await handleGetUserById(req, res);
});

userRoute.get('/*', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send('No support for API');
});
