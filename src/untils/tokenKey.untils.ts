export const createToken = async (req: Request, res: Response) => {
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
      ...(userData.publicKey && { accessToken: userData.publicKey }),
      ...(userData.refreshToken && { refreshToken: userData.refreshToken })
    });
  };
  