'use strict'
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

import { multerFile, updateAvatar} from '../../helpers/image';
import { UserData } from '../../databases/interface/userInterface';
import userService from '../../services/user.service';
import instanceStorageFireball from '../../databases/firebase/firebase.init';
import { logger } from '../../log';
import path from 'path';
import { DataUserUpdate } from '../../services/common/interface';
import { isValidDate, isValidEmail, isValidPhoneNumber } from './utils';

class UserController {

    // upload image

    handleUpdateImageUser = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            logger.info(`[P]::update avatar::`);

            // files = req.files;
            updateAvatar.array('image')(req, res, async function (err) {
              const {id} = req.body;
              if(!id){
                  return res.status(400).json({
                      errCode: 400,
                      message: 'Missing inputs value'
                    });
              }
              if (err) {
                  return res.status(400).json({
                      errCode: 400,
                      message: "Error uploading image.",
                  });
              }
              const files= req.files as Express.Multer.File[];
              if (!files || files.length === 0) {
                  return res.status(400).json({
                    errCode: 400,
                    message: 'No files uploaded.',
                  });
                }

              // Initialize an array to store the Firebase URLs
              const imageUrls: string[] = [];

              for (const file of files) {
                  try {
                    // Upload each image to Firebase
                    const imageUrl = await instanceStorageFireball.uploadImage(file);
                    imageUrls.push(imageUrl);
                  } catch (uploadErr) {
                    console.log('Error uploading image to Firebase:', uploadErr);
                    return res.status(500).json({
                      errCode: 500,
                      message: 'Error uploading image to Firebase.',
                    });
                  }
                }
                const userData: UserData = await userService.updateImage(imageUrls[0],id);
        
                return res.status(userData.status).json({
                    errCode: userData.errCode,
                    message: userData.errMessage,
                    ...(userData.userInfor && { userInfo: userData.userInfor }),
                  });               
            }); 
        } catch(error){
            // next(error)
            console.error(`Error handling update image request: ${error}`);
            return res.status(500).json({
              errCode: 500,
              message: 'Server error .',
            });
        }
    }

    // update password

    

    // get user by id

    handleGetUserById= async(req: Request, res: Response, next: NextFunction)=>{
      try{
          const id = req.query.id as string;
          console.log(`[P]::get uer with id ::`, id);
          if(!id ){
              return res.status(400).json({
                  errCode: 400,
                  message: 'Missing inputs value'
                });
          }
          const userData: UserData = await userService.getUserById(id);
        
          return res.status(userData.status).json({
              errCode: userData.errCode,
              message: userData.errMessage,
              ...(userData.userInfor && { userInfo: userData.userInfor }),
              });
      } catch(error){
          next(error)
      }
    }

    //remove account 
    handleUpdateStatusUser = async(req: Request, res: Response, next: NextFunction)=>{
      try{
          const {idUser, password} = req.body;
          if(!idUser && !password){
              return res.status(400).json({
                  errCode: 400,
                  message: 'Missing inputs value'
                });
          }
          const userData: UserData = await userService.removeUser(idUser, password);
        
          return res.status(userData.status).json({
              errCode: userData.errCode,
              message: userData.errMessage,
              });
      } catch(error){
          next(error)
      }
    }
    // update user by id

    handleUpdateUserById = async(req: Request, res: Response, next: NextFunction)=>{
      try{
          const {id, fullName, phone, birthday, gender, email, urlAvatar} = req.body;
          console.log(`[P]::update user with id ::`, id);
          if(!id && !fullName && !email ){
              return res.status(400).json({
                  errCode: 400,
                  message: 'id, name, email is required to update'
                });
          }
          let birthDate: Date | null = null;
          if (birthday) {
            const [day, month, year] = birthday.split('-').map(Number);
            
            if (isValidDate(day, month, year)) {
              birthDate = new Date(year, month - 1, day); 
            } else {
              console.log("Invalid date");
              return res.status(400).json({
                errCode: 400,
                message: 'Birthday format "DD-MM-YYYY" and date must be valid'
              });
            }          
          }
          
          if (phone) {           
            if (!isValidPhoneNumber(phone)) {
              console.log("Invalid phone");
              return res.status(400).json({
                errCode: 400,
                message: `Phone must be valid - ${phone}`
              });
            } 
          }
          if (email) {
            if (!isValidEmail(email)) {

              console.log("Invalid email");
              return res.status(400).json({
                errCode: 400,
                message: `Email must be valid - ${email}`
              });
            }
          }
          const DataUpdate: DataUserUpdate ={
            id: id,
            fullName: fullName,
            phone: phone,
            birthday: birthDate,
            gender: gender,
            email: email,
            urlAvatar: urlAvatar
          }
          const userData: UserData = await userService.updateInforById(DataUpdate);
        
          return res.status(userData.status).json({
              errCode: userData.errCode,
              message: userData.errMessage,
              ...(userData.userInfor && { userInfo: userData.userInfor }),
              });
      } catch(error){
          next(error)
      }
    }
    
    // update password by id
    handleUpdatePassword = async(req: Request, res: Response, next: NextFunction)=>{
      try{
          const {id, oldPassword, newPassword} = req.body;
          console.log(`[P]::update user password with id ::`, id);
          if(!id && !oldPassword && newPassword){
              return res.status(400).json({
                  errCode: 400,
                  message: 'Missing inputs value'
                });
          }
          const userData: UserData = await userService.updateNewPass(id, oldPassword, newPassword);
        
          return res.status(userData.status).json({
              errCode: userData.errCode,
              message: userData.errMessage,
              ...(userData.userInfor && { userInfo: userData.userInfor }),
              });
      } catch(error){
          next(error)
      }
    }

}
export default new UserController();