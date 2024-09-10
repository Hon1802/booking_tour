'use strict'
import { UserData } from '../../databases/interface/userInterface';
import { handleUserRegister, handleUserLogin } from '../../services/userService';
import { Request, Response } from 'express';
// import validate
import { userValidate } from '../../helpers/validation';
import { logger } from '../../log';
function isValidDate(dateString:string) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
// Handle user registration request
export const handleRegister = async (req: Request, res: Response) => {
  const { fullName, address, email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({
      errCode: 400,
      message: 'Missing inputs value'
    });
  }
  const userData: UserData = await handleUserRegister(fullName, address, email, password);

  return res.status(userData.status).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    ...(userData.userInfor && { userInfo: userData.userInfor }),
    ...(userData.accessToken && { accessToken: userData.accessToken }),
    ...(userData.refreshToken && { refreshToken: userData.refreshToken })
  });
};

// Handle user login request
export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Validate data
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: 'Missing inputs value'
    });
  }
  const { error } = userValidate({ email, password });
  if(error){
    logger.error(error.details[0].message)
    return res.status(500).json({
      errCode: 1,
      message: `${error.details[0].message}`
    });
  }

  const userData: UserData = await handleUserLogin(email, password);

  return res.status(userData.status).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    ...(userData.userInfor && { userInfo: userData.userInfor }),
    // ...(userData.accessToken && { accessToken: userData.accessToken }),
    ...(userData.refreshToken && { refreshToken: userData.refreshToken })
  });
};

// Handle user login request
export const handleLogout = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: 'Missing inputs value'
    });
  }
  const userData: UserData = await handleUserLogin(email, password);

  return res.status(userData.status).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    ...(userData.userInfor && { userInfo: userData.userInfor }),
    // ...(userData.accessToken && { accessToken: userData.accessToken }),
    ...(userData.refreshToken && { refreshToken: userData.refreshToken })
  });
};

// Handle user login request
export const handleForgotPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: 'Missing inputs value'
    });
  }
  const userData: UserData = await handleUserLogin(email, password);

  return res.status(userData.status).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    ...(userData.userInfor && { userInfo: userData.userInfor }),
    // ...(userData.accessToken && { accessToken: userData.accessToken }),
    ...(userData.refreshToken && { refreshToken: userData.refreshToken })
  });
};
