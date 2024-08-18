import { UserData } from '../../databases/interface/userInterface';
import { handleUserId } from '../../services/userService';
import { Request, Response } from 'express';

function isValidDate(dateString:string) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

// Handle user get information by id
export const handleGetUserById = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      errCode: 1,
      message: 'Missing inputs value'
    });
  }
  const userData: UserData = await handleUserId(id);

  return res.status(userData.status).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    ...(userData.userInfor && { userInfo: userData.userInfor }),
    ...(userData.accessToken && { accessToken: userData.accessToken }),
    ...(userData.refreshToken && { refreshToken: userData.refreshToken })
  });
};



