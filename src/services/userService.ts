'use strict'
import { AppDataSource } from '../databases/connectDatabase';
import { UserData } from '../databases/interface/userInterface';
import { User } from '../databases/models/entities/User';
import { logger } from '../log';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import currentConfig from '../config';
import { validate } from 'class-validator';
// import { ObjectId } from 'typeorm';
import { ObjectId } from 'mongodb';
const managerUser = AppDataSource.mongoManager;

// some const
const jwt_secret = currentConfig.app.jwt_secret;
const salt_rounds = currentConfig.app.salt_rounds;

export const handleUserRegister = async (
  fullName: string,
  address: string,
  email: string,
  password: string,
  dateOfBirth: Date,
  phone: string,
  gender: string
): Promise<UserData> => {
  let userData: UserData;
  let isExist = await managerUser.findOne(User, { where: { email } });
  if (isExist) {
    userData = {
      status: 409,
      errCode: 409,
      errMessage: 'Existing user with the provided username.'
    };
  } else {
    const user = new User();
    let refreshToken = jwt.sign(
      {
        data: {
          name: fullName,
          email: email,
          role: 'user'
        }
      },
      jwt_secret,
      {
        expiresIn: '30 days' //
      }
    );
    user.name = fullName;
    user.address = address;
    user.email = email;
    user.dateOfBirth = new Date(dateOfBirth);
    user.password = await bcrypt.hash(password, parseInt(salt_rounds));
    user.phone = phone;
    user.gender = gender;
    user.refreshToken = refreshToken;
    // Kiểm tra validation của user
    const errors = await validate(user);
    if (errors.length > 0) {
        userData = {
            status: 400,
            errCode: 400,
            errMessage: errors.map(err => ({
                property: err.property,
                constraints: err.constraints
              })),
          };
    } else{
        try {    
          await managerUser.save(user);
          let accessToken = jwt.sign(
            {
              data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: 'user'
              }
            },
            jwt_secret,
            {
              expiresIn: '1h' //
            }
          );
    
          logger.info('User saved:', user);
          userData = {
            status: 200,
            errCode: 200,
            errMessage: 'User registered successfully.',
            userInfor: {
              name: user.name,
              address: user.address,
              email: user.email,
              dateOfBirth: user.dateOfBirth,
              phone: user.phone,
              gender: user.gender,
              avata: 'no_image',
              id: user.id
            },
            accessToken: accessToken,
            refreshToken: refreshToken
          };
        } catch (error) {
          userData = {
            status: 500,
            errCode: 500,
            errMessage: 'Failed to register user. Please try again later.'
          };
          logger.error('Error saving user:', error);
        }
    }
  }
  return userData;
};
export const handleUserLogin = async (email: string, password: string): Promise<UserData> => {
  let userData: UserData;
  let isExist = await managerUser.findOne(User, { where: { email } });
  if (isExist && isExist.delFlg == 0) {
    let isMatch = await bcrypt.compare(password,isExist.password)
    if(!!isMatch){
        let refreshToken = jwt.sign(
            {
              data: {
                _id: isExist.id,
                name: isExist.name,
                email: isExist.email,
                role: isExist.userFlg == 1 ? 'user' : 'admin'
              }
            },
            jwt_secret,
            {
              expiresIn: '30 days' //
            }
          );
        let accessToken = jwt.sign(
            {
              data: {
                _id: isExist.id,
                name: isExist.name,
                email: isExist.email,
                role: isExist.userFlg == 1 ? 'user' : 'admin'
              }
            },
            jwt_secret,
            {
              expiresIn: '1h' //
            }
          );
        userData = {
            status: 200,
            errCode: 200,
            errMessage: 'Login successfully.',
            userInfor: {
                name: isExist?.name,
                role: isExist.userFlg == 1 ? 'user' : 'admin',
                address: isExist?.address,
                email: isExist?.email,
                dateOfBirth: isExist?.dateOfBirth,
                phone: isExist?.phone,
                gender: isExist?.gender,
                avata: isExist?.avatar,
                id: isExist?.id
            },
        accessToken: accessToken,
        refreshToken: refreshToken
        };
        if(isExist.id)
            {
                saveToken(isExist?.id , refreshToken);
            }
        return userData;
    }else{
        userData = {
            status: 401,
            errCode: 401,
            errMessage: 'Unauthorized - Incorrect email or password'
        };
    }
  } else {
    userData = {
        status: 401,
        errCode: 401,
        errMessage: 'Unauthorized - Incorrect email or password'
      };
  }
  return userData;
};
// get information user by id
export const handleUserId = async (id: string): Promise<UserData> => {
  let userData: UserData;
  try{
    const objectId = new ObjectId(id);
    let isExist = await managerUser.findOne(User, { where: { _id: objectId } });
    if (isExist && isExist.delFlg == 0) {
      userData = {
          status: 200,
          errCode: 200,
          errMessage: 'User information :',
          userInfor: {
              name: isExist?.name,
              role: isExist.userFlg == 1 ? 'user' : 'admin',
              address: isExist?.address,
              email: isExist?.email,
              dateOfBirth: isExist?.dateOfBirth,
              phone: isExist?.phone,
              gender: isExist?.gender,
              avata: isExist?.avatar,
              id: isExist?.id
          },
      };
      logger.info(`Send information of ${id} success`);
      return userData;
    } else {
      logger.error(`Send information of ${id} had error`);
      userData = {
          status: 404,
          errCode: 404,
          errMessage: '404 - Not Found '
        };
    }
    return userData;
  } catch(error){
    if (error instanceof Error) {
      logger.error(`Error fetching user with ID ${id}: ${error.message}`);
    } else {
      logger.error(`Unknown error: ${String(error)}`);
    }
    userData = {
        status: 404,
        errCode: 404,
        errMessage: '404 - Not Found '
      };
    return userData;
    
  }
};
// check freshtoken
export const checkTokenExist = async (token: string): Promise<boolean> => {
  // Implement your token existence check logic here
  // This is a placeholder, replace it with actual implementation

  return true;
};
// 
export const saveToken = async (userId: ObjectId,freshtoken: string): Promise<boolean> => {
    const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
        // Điều kiện tìm kiếm
        { _id: userId },
        // Cập nhật dữ liệu
        { $set: { 
            refreshToken: freshtoken 
        } }
      );
    return false;
  };