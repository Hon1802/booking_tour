'use strict';

import { AppDataSource } from '../databases/connectDatabase';
const managerUser = AppDataSource.mongoManager;
import { User } from '../databases/models/entities/User';
import crypto from 'crypto';
import createTokenPair from '../auth/authen';
import { logger } from '../log';
import { UserData } from '../databases/interface/userInterface';
import bcrypt from 'bcrypt';
import currentConfig from '../config';
import { validate } from 'class-validator';
import { saveToken } from './userService';
import { sentMail } from '../helpers/sentEmail';
import { ObjectId } from 'mongodb';
import { generatePassword } from '../helpers/common';
// some const
const privateKey = currentConfig.app.privateKey;
const publicKey = currentConfig.app.publicKey
const salt_rounds = currentConfig.app.salt_rounds;
const from_email = currentConfig.app.from_email;
const secret_email = currentConfig.app.secret_email;

class AccessService {
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
        // // create private key and public key
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // });

        // create token pair
        const tokens = await createTokenPair({ userId: user.id?.toString(), email }, publicKey.toString(), privateKey);
        // update infor
        user.name = fullName;
        user.address = address;
        user.email = email;
        user.password = password;
        // user.password = await bcrypt.hash(password, parseInt(salt_rounds));
        user.gender = gender;
        user.delFlg = 0;
        user.userFlg = 1;

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
          user.password = await bcrypt.hash(password, parseInt(salt_rounds));
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
              avatar: 'no_image',
              gender: user.gender,
              id: user.id,
              role: 'user'
            },
            accessToken: tokens?.accessToken,
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
  // sign In
  userLogIn = async (email: string, password: string): Promise<UserData> => {
    try {
      // step 1: check email exist ??
      let userData: UserData;
      let holderStore = await managerUser.findOne(User, { where: { email } });
      console.log(holderStore?.delFlg)
      // if exist return, not exist, continue to next step
      if (holderStore && holderStore.delFlg != -1) {
        let isMatch = await bcrypt.compare(password, holderStore.password);

        if (!!isMatch) {
          // create private key and public key

          // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          //   modulusLength: 4096,
          //   publicKeyEncoding: {
          //     type: 'pkcs1',
          //     format: 'pem'
          //   },
          //   privateKeyEncoding: {
          //     type: 'pkcs1',
          //     format: 'pem'
          //   }
          // });

          // create token pair
          const roles = holderStore.userFlg?.toString().trim() === '1' ? 'user' : 'admin';
          console.log(roles, 'l',holderStore )
          const tokens = await createTokenPair(
            { userId: holderStore.id?.toString(), role: roles, email },
            publicKey.toString(),
            privateKey
          );
          console.log('Created token Success:: ', tokens);
          if (!tokens) {
            userData = {
              status: 400,
              errCode: 400,
              errMessage: 'can not login'
            };
            logger.error('can not create token');
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
              avatar: holderStore?.urlAvatar,
              id: holderStore?.id
            },
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken
          };
          if (holderStore.id) {
            saveToken(holderStore?.id, tokens.refreshToken.toString(), tokens.accessToken.toString());
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
  // sign out
  userLogOut = async (userId: string): Promise<UserData> => {
    try {
      // step 1: check email exist ??
      let userData: UserData;
      //   const obId = new mongoose.Types.ObjectId(userId);
      const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
        // condition to find
        { _id: new ObjectId(userId) },
        // Set publicKey and refresh Token
        {
          $set: {
            accessToken: '',
            refreshToken: ''
          }
        }
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
      return userData;
    }
  };
  // for got password
  getPassword = async (email: string): Promise<UserData> => {
    try {
      // step 1: check email exist ??
      let userData: UserData;

      function getRandomWordFromList(words: string[]): string {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
      }

      // generate new password
      const newPass = generatePassword();
      console.log(newPass)

      const passBcrypt = await bcrypt.hash(newPass, parseInt(salt_rounds));
      // sent
      sentMail(
        from_email,
        email,
        secret_email,
        newPass,
        'Forgot Password'
      );
      logger.info(newPass)
      const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
        // Điều kiện tìm kiếm
        { email: email },
        // Cập nhật dữ liệu
        {
          $set: {
            password: passBcrypt
          }
        }
      );

      userData = {
        status: 200,
        errCode: 200,
        errMessage: `Password sender to ${email} `
      };
      return userData;
    } catch (error) {
      // Type-asserting error to be of type Error
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.log(error);
      //   logger.error(error)
      return userData;
    }
  };
}

export default new AccessService();
