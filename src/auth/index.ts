'use strict';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { checkTokenExist } from '../services/userService';
import { logger } from '../log';
import currentConfig from '../config';
import { pathToRegexp } from 'path-to-regexp';
// const
const privateKey = currentConfig.app.privateKey;
const publicKey = currentConfig.app.publicKey;

// Định nghĩa kiểu payload
interface MyJwtPayload extends JwtPayload {
  role: string;
  exp: number;
}

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  // set headers
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  // List of URLs to bypass
  const bypassUrls = [
    '/', 
    '/v1/api/sign-up', 
    '/v1/api/sign-in',
    '/v1/api/log-out',
    '/v1/api/forgot-password',
    '/v1/api/get-tour-by-number/',
    '/v1/api/get-tour-by-id/:tourid',
].map((url) => url.toLowerCase().trim());

  // List of URLs for admin access

  const adminUrls = [
    '/v1/api/admin/new-tour',
    '/v1/api/admin/get-tour-by-id/:tourid',
    '/v1/api/admin/update-tour-status/',
    '/v1/api/admin/get-tour-by-number/:count',
    '/v1/api/admin/get-tour-by-number/',
    '/v1/api/admin/update-tour-image'

    ].map((url) => url.toLowerCase().trim());

     // List of URLs for admin access

  const userUrl = [
    '/v1/api/get-tour-by-number/', 
    '/v1/api/get-tour-by-id/:id',
    '/v1/api/upload-avatar',
    '/v1/api/delete-account'

    ].map((url) => url.toLowerCase().trim());

  // Check if URL is in bypass list
  
    const isPassUrl = bypassUrls.some((passUrl) => {
        const regex = pathToRegexp(passUrl);
        return regex.test(req.url.toLowerCase().trim());
    });
    if (isPassUrl) {
        return next(); // URL hợp lệ, tiếp tục xử lý
    } 
    ;
    if (bypassUrls.includes(req.url.toLowerCase().trim())) {
    return next();
  }

  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      errCode: 1,
      message: 'No token provided'
    });
  }

  try {
    // check token 
    const tokenExists = await checkTokenExist(token);

    jwt.verify(token, publicKey, (err, decode) => {
      if (err) {
        logger.error('error verify', err);
        const status = err instanceof TokenExpiredError ? 401 : 403;
        return res.status(status).json({
          errCode: 1,
          message: 'Token is invalid or expired'
        });
      } else {
        // logger.info('decode verify', decode);
        if (decode) {
          const jwtObject = decode as MyJwtPayload;

          // Tiếp tục xử lý jwtObject
          const isExpired = Date.now() > jwtObject.exp * 1000;

          // Check token expired
          if (isExpired) {
            return res.status(401).json({
              errCode: 1,
              message: 'Token is expired'
            });
          }

          // console.log(tokenExists)
          if (!tokenExists) {
            // Check for admin role
            if (jwtObject?.role === 'admin') {
                console.log(req.url.toLowerCase().trim())
              if (adminUrls.includes(req.url.toLowerCase().trim())) {
                return next();
              } else {
                const isAdminUrl = adminUrls.some((adminUrl) => {
                    const regex = pathToRegexp(adminUrl);
                    return regex.test(req.url.toLowerCase().trim());
                });
                if (isAdminUrl) {
                    return next(); // URL hợp lệ, tiếp tục xử lý
                } else {
                    return res.status(403).json({
                        errCode: 3,
                        message: 'Not permitted',
                    });
                }
            }
            } else{
                if (userUrl.includes(req.url.toLowerCase().trim())) {
                    
                    return next();
                  } else {
                    const isUserUrl = userUrl.some((adminUrl) => {
                        const regex = pathToRegexp(adminUrl);
                        return regex.test(req.url.toLowerCase().trim());
                    });
                    if (isUserUrl) {
                        return next(); // URL hợp lệ, tiếp tục xử lý
                    } else {
                        return res.status(403).json({
                            errCode: 3,
                            message: 'Not permitted',
                        });
                    }
                  }
                // // For non-admin users
                // return next();
            }
          }
          else{
            return res.status(401).json({
                errCode: 1,
                message: 'Token is invalid'
              });
          }
        } else {
          return res.status(401).json({
            errCode: 1,
            message: 'Token is invalid'
          });
        }
      }
    });
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
