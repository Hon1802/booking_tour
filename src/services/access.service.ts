'use strict';

import { AppDataSource } from '../databases/connectDatabase';
const managerUser = AppDataSource.mongoManager;
import { User } from '../databases/models/entities/User';
import crypto from 'crypto';
import KeyTokenServirce from './keyToken.service';
import createTokenPair from '../auth/authen';
import { logger } from '../log';
import { ObjectId } from 'typeorm';
import { UserData } from '../databases/interface/userInterface';
import bcrypt from 'bcrypt';
import currentConfig from '../config';
import { validate } from 'class-validator';
import { saveToken } from './userService';
import mongoose from 'mongoose';
import { sentMail } from '../helpers/sentEmail';
// some const
const jwt_secret = currentConfig.app.jwt_secret;
const salt_rounds = currentConfig.app.salt_rounds;

class AccessService {
  // test
  // signUp = async (email: string, password: string) =>{
  //     try{
  //         // step 1: check email exist ??
  //         let holderStore = await managerUser.findOne(User, { where: { email } });
  //         // if exist return, not exist, continue to next step
  //         if (holderStore) {
  //             return {
  //                 code: 'xxxx',
  //                 message: 'User already register '
  //             }
  //           } else {
  //             const user = new User();
  //             // create private key and public key

  //             const USID = user.id?.toString();

  //             const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
  //                 modulusLength: 4096,
  //                 publicKeyEncoding: {
  //                     type: 'pkcs1',
  //                     format: 'pem'
  //                 },
  //                 privateKeyEncoding:{
  //                     type: 'pkcs1',
  //                     format: 'pem'
  //                 }
  //             })
  //             // publickey cryptoGraphy standards
  //             console.log(privateKey, 'va', publicKey)
  //             const publicKeyString = await KeyTokenServirce.createKeyToken({
  //                 userId: user.id as ObjectId,
  //                 publicKey
  //             })

  //             if(!publicKeyString){
  //                 return {
  //                     code: 'xxxx',
  //                     message: 'publickeyString error '
  //                 }
  //             }

  //             const publicKeyObject = crypto.createPublicKey(publicKeyString)

  //             // create token pair
  //             const tokens = await createTokenPair({userId: (user.id)?.toString(), email}, publicKeyString, privateKey)
  //             console.log('Created token Success:: ', tokens);

  //             return {
  //                 code: 201,
  //                 metadata:{
  //                     user: user,
  //                     tokens
  //                 }
  //             }

  //           }
  //     }catch(error){
  //         // Type-asserting error to be of type Error
  //         if (error instanceof Error) {
  //             return {
  //                 code: 'XXX', // Replace 'XXX' with an appropriate error code
  //                 message: error.message,
  //                 status: 'error'
  //             };
  //         } else {
  //             // Handle the case where error is not an instance of Error
  //             return {
  //                 code: 'XXX',
  //                 message: 'An unknown error occurred',
  //                 status: 'error'
  //             };
  //         }
  //     }
  // };
  userRegister = async (
    fullName: string,
    address: string,
    email: string,
    password: string,
    gender: string
  ): Promise<UserData> => {
    try {
      // step 1: check email exist ??
      let userData: UserData;
      let holderStore = await managerUser.findOne(User, { where: { email } });
      // if exist return, not exist, continue to next step
      if (holderStore) {
        userData = {
          status: 409,
          errCode: 409,
          errMessage: 'Existing user with the provided username.'
        };
        return userData;
      } else {
        const user = new User();
        // create private key and public key

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          }
        });

        // create token pair
        const tokens = await createTokenPair({ userId: user.id?.toString(), email }, publicKey.toString(), privateKey);
        console.log('Created token Success:: ', tokens);
        // update infor
        user.name = fullName;
        user.address = address;
        user.email = email;
        user.password = await bcrypt.hash(password, parseInt(salt_rounds));
        user.gender = gender;

        // Kiểm tra validation của user
        const errors = await validate(user);
        if (errors.length > 0) {
          userData = {
            status: 400,
            errCode: 400,
            errMessage: errors.map((err) => ({
              property: err.property,
              constraints: err.constraints
            }))
          };
        } else {
          await managerUser.save(user);
          logger.info('User saved:', user);
          userData = {
            status: 200,
            errCode: 200,
            errMessage: 'User registered successfully.',
            userInfor: {
              name: user.name,
              address: user.address,
              email: user.email,
              avata: 'no_image',
              gender: user.gender,
              id: user.id
            },
            publicKey: tokens?.accessToken,
            refreshToken: tokens?.refreshToken
          };
        }

        return userData;
      }
    } catch (error) {
      // Type-asserting error to be of type Error
      const userData = {
        status: 400,
        errCode: 400,
        errMessage: 'Can not sign up'
      };
      return userData;
    }
  };
  // signin
  userLogIn = async (email: string, password: string): Promise<UserData> => {
    try {
      // step 1: check email exist ??
      let userData: UserData;
      let holderStore = await managerUser.findOne(User, { where: { email } });
      // if exist return, not exist, continue to next step
      if (holderStore) {
        let isMatch = await bcrypt.compare(password, holderStore.password);

        if (!!isMatch) {
          // create private key and public key

          const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'pkcs1',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs1',
              format: 'pem'
            }
          });

          // create token pair
          const tokens = await createTokenPair(
            { userId: holderStore.id?.toString(), email },
            publicKey.toString(),
            privateKey
          );
          console.log('Created token Success:: ', tokens);
          if(!tokens)
          {
            userData = {
                status: 400,
                errCode: 400,
                errMessage: 'can not login'
              };
            logger.error('can not create token')
            return userData;
          }
          userData = {
            status: 200,
            errCode: 200,
            errMessage: 'Login successfully.',
            userInfor: {
              name: holderStore?.name,
              role: holderStore.userFlg == 1 ? 'user' : 'admin',
              email: holderStore?.email,
              avata: holderStore?.avatar,
              id: holderStore?.id
            },
            publicKey: tokens?.accessToken,
            refreshToken: tokens?.refreshToken
          };
          if(holderStore.id)
              {
                saveToken(holderStore?.id , tokens.refreshToken.toString(), tokens?.accessToken.toString());
              }
          return userData;
        } else {
          userData = {
            status: 401,
            errCode: 401,
            errMessage: 'Unauthorized - Incorrect email or password'
          };
          return userData;
        }
      } else {
        userData = {
          status: 401,
          errCode: 401,
          errMessage: 'Unauthorized - Incorrect email or password'
        };
        return userData;
      }
    } catch (error) {
      // Type-asserting error to be of type Error
      const userData = {
        status: 400,
        errCode: 400,
        errMessage: 'Can not sign up'
      };
      return userData;
    }
  };
   // signin
   userLogOut = async (userId: string): Promise<UserData> => {
    try {
      // step 1: check email exist ??
      let userData: UserData;
 
        //   const obId = new mongoose.Types.ObjectId(userId);
    
    //   logger.info(obId)
      const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
        // Điều kiện tìm kiếm
        { _id: userId },
        // Cập nhật dữ liệu
        { $set: { 
            publicKey: '',
            refreshToken: ''
        } }
      );
      logger.info(user)

      // if exist return, not exist, continue to next step
      
        userData = {
          status: 200,
          errCode: 200,
          errMessage: 'Log out success'
        };
        return userData;
      
    } catch (error) {
      // Type-asserting error to be of type Error
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.log(error)
    //   logger.error(error)
      return userData;
    }
  };// signin
  getPassword = async (email: string): Promise<UserData> => {
    try {
      // step 1: check email exist ??
      let userData: UserData;
 
      function getRandomWordFromList(words: string[]): string {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
      }
      
      // Ví dụ sử dụng
      const wordList = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

        //   const obId = new mongoose.Types.ObjectId(userId);
        const newpass = getRandomWordFromList(wordList);
        const passBcrypt = await bcrypt.hash(newpass, parseInt(salt_rounds));
        // sent
        sentMail('soihoang1802@gmail.com', '20110371@student.hcmute.edu.vn', 'f2d626d05d621df4b1a1102e1cd7d291f63fd0a6', newpass )
    //   logger.info(obId)
      const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
        // Điều kiện tìm kiếm
        { email: email },
        // Cập nhật dữ liệu
        { $set: { 
            password: passBcrypt
        } }
      );

      // if exist return, not exist, continue to next step
      
        userData = {
          status: 200,
          errCode: 200,
          errMessage: 'Log out success'
        };
        return userData;
      
    } catch (error) {
      // Type-asserting error to be of type Error
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.log(error)
    //   logger.error(error)
      return userData;
    }
  };
}

export default new AccessService();
