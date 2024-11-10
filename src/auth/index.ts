'use strict';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { checkTokenExist } from '../services/userService';
import { logger } from '../log';
import currentConfig from '../config';
import { pathToRegexp } from 'path-to-regexp';
import { adminUrls, bypassUrls, userUrl } from './path';
import errorCodes from '../common/errorCode/errorCodes';
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
  
  const URL_REQUEST = req.url.toLowerCase().trim();

  logger.info(`url client: ${URL_REQUEST}`)

  // Check if URL is in bypass list without token
  // Bỏ qua kiểm tra token cho đường dẫn `/api-docs`
  if (URL_REQUEST.startsWith('/api-docs')) {
    return next();
  }
  
  const isPassUrl = bypassUrls.some((passUrl) => {
    const pathFromRequest = URL_REQUEST.split('?')[0];
    logger.info(`transform: ${pathFromRequest}`)
    const regex = pathToRegexp(passUrl);
    return regex.test(pathFromRequest);
  });

  console.log('check', isPassUrl)
  if (isPassUrl) {
    return next(); 
  }

  // if have token

  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      errCode: errorCodes.AUTH.NO_TOKEN.code,
      message: errorCodes.AUTH.NO_TOKEN.message
    });
  }

  try {
    // check token
    const tokenExists = await checkTokenExist(token);

    // verify token with public Key

    jwt.verify(token, publicKey, (err, decode) => {
      if (err) {
        logger.error('error verify', err);
        const status = err instanceof TokenExpiredError ? 401 : 403;
        return res.status(status).json({
          errCode: errorCodes.AUTH.ERROR_CODE_VERIFY.code,
          message: errorCodes.AUTH.ERROR_CODE_VERIFY.message
        });
      } else {

        if (decode) {
          const jwtObject = decode as MyJwtPayload;

          // Check token expired, if expired return, else continue

          const isExpired = Date.now() > jwtObject.exp * 1000;

          if (isExpired) {
            return res.status(401).json({
              errCode: errorCodes.AUTH.TOKEN_EXPIRED.code,
              message: errorCodes.AUTH.TOKEN_EXPIRED.message
            });
          }

          if (!tokenExists) {
            // get role of token
            const roleUser = jwtObject?.role;
            const pathUrlUser = roleUser ==='admin' ? adminUrls : userUrl; 
            // Check for admin role
            console.log(pathUrlUser)
            if (roleUser) {
              if (pathUrlUser.includes(URL_REQUEST)) {
                return next();
              } else {
                const pathFromRequest = URL_REQUEST.split('?')[0];
                console.log(pathFromRequest)
                const isUserUrl = pathUrlUser.some((useUrl ) => {
                  const regex = pathToRegexp(useUrl);
                  // return regex.test(URL_REQUEST);
                  return regex.test(pathFromRequest);
                });
                if (isUserUrl) {
                  return next(); // URL hợp lệ, tiếp tục xử lý
                } else {
                  return res.status(403).json({
                    errCode: errorCodes.AUTH.PERMISSION_DENIED.code,
                    message: errorCodes.AUTH.PERMISSION_DENIED.message
                  });
                }
              }
            } else{
              return res.status(401).json({
                errCode: errorCodes.AUTH.INVALID_TOKEN.code,
                message: errorCodes.AUTH.INVALID_TOKEN.message
              });
            }
          } else {
            return res.status(401).json({
              errCode: errorCodes.AUTH.INVALID_TOKEN.code,
              message: errorCodes.AUTH.INVALID_TOKEN.message
            });
          }
        } else {
          return res.status(401).json({
            errCode: errorCodes.AUTH.INVALID_TOKEN.code,
            message: errorCodes.AUTH.INVALID_TOKEN.message
          });
        }
      }
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      logger.error('Token has expired');
      // Xử lý logic khi token đã hết hạn
      return res.status(401).json({
        errCode: errorCodes.AUTH.INVALID_TOKEN.code,
        message: errorCodes.AUTH.INVALID_TOKEN.message
      });
    } else {
      logger.error('Token verification failed:', error);
      // Xử lý lỗi khác
      return res.status(401).json({
        errCode: errorCodes.AUTH.ERROR_UNCERTAIN.code,
        message: errorCodes.AUTH.ERROR_UNCERTAIN.message
      });
    }
  }
};

export default checkToken;
