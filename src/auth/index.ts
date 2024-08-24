'use strict'
import { Request, Response, NextFunction } from 'express';
import jwt,{ TokenExpiredError } from 'jsonwebtoken';
import { checkTokenExist } from '../services/userService';
import { logger } from '../log';
const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  // set headers
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  // List of URLs to bypass
  const bypassUrls = [
    '/',
    '/v1/api/sign-up',
    '/api',
    // '/api/customer/register',
    '/api/customer/login',
    // '/api/logout',
    // '/auth/logout',
    // '/api/register',
    // '/api/hot-tour',
    // '/api/filter-tour',
    // '/api/latest-tour',
    // '/api/get-all-tours',
    // '/auth/login/failed',
    // '/auth/login/success',
    // '/api/get-tour-by-id',
    // '/auth/google/callback'
  ].map((url) => url.toLowerCase().trim());
  // check url pass or check token
  if (bypassUrls.includes(req.url.toLowerCase().trim())) {
    next();
    return;
  }

  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      errCode: 1,
      message: 'No token provided'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const jwtObject = jwt.verify(token, jwtSecret) as { exp: number };
    const isExpired = Date.now() > (jwtObject.exp* 1000) ;

    if (isExpired) {
      return res.status(401).json({
        errCode: 1,
        message: 'Token is expired'
      });
    } else {
      const tokenExists = await checkTokenExist(token);
      if (!tokenExists) {

        next();
      } else {
        return res.status(401).json({
          errCode: 1,
          message: 'Token is invalid'
        });
      }
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      logger.error('Token has expired');
      // Xử lý logic khi token đã hết hạn
       return res.status(401).json({
        errCode: 1,
        message: 'Token is expired'
      });
    } else {
      logger.error('Token verification failed:', error);
      // Xử lý lỗi khác
      return res.status(401).json({
        errCode: 1,
        message: `Token verification failed: ${error}`
      });
    }
  }
};

export default checkToken;
