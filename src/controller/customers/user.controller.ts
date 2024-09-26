'use strict'
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

import { multerFile, updateAvatar} from '../../helpers/image';
import { UserData } from '../../databases/interface/userInterface';
import userService from '../../services/user.service';
import instanceStorageFireball from '../../databases/firebase/firebase.init';
import { logger } from '../../log';
import path from 'path';

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
                    console.error('Error uploading image to Firebase:', uploadErr);
                    return res.status(500).json({
                      errCode: 500,
                      message: 'Error uploading image to Firebase.',
                    });
                  }
                }
                console.log('1')
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

}
export default new UserController();