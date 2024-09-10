'use strict'
import { Request, Response, NextFunction } from 'express';
import accessService from '../../services/access.service';
import { UserData } from '../../databases/interface/userInterface';
class AccessController {
    // register
    handleRegister = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const { fullName, address, email, password, gender} = req.body;

            console.log(`[P]::registerUser::`, req.body);
            if (!email || !password) {
                return res.status(400).json({
                  errCode: 400,
                  message: 'Missing inputs value'
                });
              }      
            const userData: UserData = await accessService.userRegister(fullName, address, email, password.toString().trim(), gender);
        
            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage,
                ...(userData.userInfor && { userInfo: userData.userInfor }),
                ...(userData.accessToken && { accessToken: userData.accessToken }),
                ...(userData.refreshToken && { refreshToken: userData.refreshToken })
              });
        } catch(error){
            next(error)
        }
    }
    // sign in
    handleSignIn = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const { email, password} = req.body;

            console.log(`[P]::logInUser::`, req.body);
            if (!email || !password) {
                return res.status(400).json({
                  errCode: 400,
                  message: 'Missing inputs value'
                });
              }      
            const userData: UserData = await accessService.userLogIn(email, password);
        
            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage,
                ...(userData.userInfor && { userInfo: userData.userInfor }),
                ...(userData.accessToken && { accessToken: userData.accessToken }),
                ...(userData.refreshToken && { refreshToken: userData.refreshToken })
              });
        } catch(error){
            next(error)
        }
    }
    // log out
    handleLogOut = async (req: Request, res: Response, next: NextFunction)=>{
        try{

            const { id} = req.body;

            console.log(`[P]::logoutUser::`, req.body);
             
            const userData: UserData = await accessService.userLogOut(id);
        
            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage
              });
        } catch(error){
            next(error)
        }
    }
    // forgot Pass
    handleForgotPassword = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const { email} = req.body;

            console.log(`[P]::registerUser::`, req.body);
            if (!email) {
                return res.status(400).json({
                  errCode: 400,
                  message: 'Missing inputs value'
                });
              }      
            const userData: UserData = await accessService.getPassword(email);
        
            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage,
              });
        } catch(error){
            next(error)
        }
    }
}

export default new AccessController();