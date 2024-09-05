'use strict'
import { Router, Request, Response } from 'express';
import { handleRegister, handleLogin, handleLogout } from '../../controller/customers';

export const customerRoute = Router();

const sendJsonResponse = (res: Response, content: object) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.json(content);
};

customerRoute.get('/', (req: Request, res: Response) => sendJsonResponse(res, { message: 'API for customer' }));

customerRoute.post('/login', async (req: Request, res: Response) => {
  await handleLogin(req, res);
});

customerRoute.post('/logout', async (req: Request, res: Response) => {
  await handleLogout(req, res);
});

customerRoute.post('/register', async (req: Request, res: Response) => {
  await handleRegister(req, res);
});

customerRoute.post('/forgot-password', async (req: Request, res: Response) => {
  await handleRegister(req, res);
});

customerRoute.get('/*', (req: Request, res: Response) => sendJsonResponse(res, { message: 'No support for API' }));
