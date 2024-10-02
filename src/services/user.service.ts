'use strict';

// lodash
import _ from 'lodash';

import { AppDataSource } from '../databases/connectDatabase';
const managerUser = AppDataSource.mongoManager;
import { User } from '../databases/models/entities/User';
import { ObjectId } from 'mongodb';
// firebase
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../log';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import instanceStorageFireball, { storageData } from '../databases/firebase/firebase.init';
import { validate } from 'class-validator';
import { number } from 'joi';
import { UserData } from '../databases/interface/userInterface';
import bcrypt from 'bcrypt';
import errorCodes from '../common/errorCode/errorCodes';
import currentConfig from '../config';
import { DataUserUpdate } from './common/interface';
import RedisConnection from '../databases/redis/redis.init';

const salt_rounds = currentConfig.app.salt_rounds;
class UsersService {
  updateNewPass = async (id: string, oldPassword: string, newPassword: string): Promise<UserData> => {
    try {
      let userData: UserData;
      if (!ObjectId.isValid(id)) {
        userData = {
          status: 400,
          errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
          errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
        };
        logger.error('error id');
        return userData;
      }
      let holderStore = await managerUser.findOne(User, { where: { _id: new ObjectId(id) } });
      if (holderStore && holderStore.delFlg != -1) {
        let isMatch = await bcrypt.compare(oldPassword, holderStore.password);
        if (!!isMatch) {
          holderStore.password = newPassword;
          const errors = await validate(holderStore, { skipMissingProperties: true });
          if (errors.length > 0) {
            userData = {
              status: 400,
              errCode: 400,
              errMessage: errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
              }))
            };
            return userData;
          } else {
            const passBcrypt = await bcrypt.hash(newPassword, parseInt(salt_rounds));
            const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
              // Điều kiện tìm kiếm
              { _id: new ObjectId(id) },
              // Cập nhật dữ liệu
              {
                $set: {
                  password: passBcrypt
                }
              }
            );
          }
        } else {
          userData = {
            status: 401,
            errCode: 401,
            errMessage: 'Unauthorized - Incorrect old password'
          };
          return userData;
        }

        if (holderStore.userFlg && holderStore.userFlg === 1) {
          _.set(holderStore, 'role', 'user');
        }

        const holderStoreWithoutPassword = _.omit(holderStore, ['password', 'delFlg', 'gender', 'userFlg']);

        userData = {
          status: 200,
          errCode: 200,
          errMessage: `Password update success `
          // userInfor: holderStoreWithoutPassword || holderStore,
        };
      } else {
        userData = {
          status: 400,
          errCode: 400,
          errMessage: `Not found user had id is ${id}`
        };
      }
      return userData;
    } catch (error) {
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      return userData;
    }
  };
  // get user by id
  getUserById = async (id: string): Promise<UserData> => {
    try {
      let userData: UserData;

      if (!ObjectId.isValid(id)) {
        userData = {
          status: 400,
          errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
          errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
        };
        logger.error('error id');
        return userData;
      }
      let holderStore = await managerUser.findOne(User, { where: { _id: new ObjectId(id) } });
      if (holderStore) {
        if (holderStore.userFlg && holderStore.userFlg === 1) {
          _.set(holderStore, 'role', 'user');
        }

        // Xóa trường 'password' trong holderStore
        const holderStoreWithoutPassword = _.omit(holderStore, ['password', 'delFlg', 'gender', 'userFlg']);

        userData = {
          status: 200,
          errCode: 200,
          errMessage: 'Find user',
          userInfor: holderStoreWithoutPassword || holderStore
        };
      } else {
        userData = {
          status: 400,
          errCode: 400,
          errMessage: `Not found user had id is ${id}`
        };
      }
      return userData;
    } catch (error) {
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      return userData;
    }
  };

  // update information of use
  updateInforById = async (UpdateData: DataUserUpdate): Promise<UserData> => {
    try {
      let userData: UserData;
      if (!ObjectId.isValid(UpdateData.id)) {
        userData = {
          status: 400,
          errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
          errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
        };
        logger.error('error id');
        return userData;
      }
      const users = await managerUser.find(User, {
        where: { email: UpdateData.email },
      });
      const count = users.length;
      console.log(count)
      if(count > 0) {
        userData = {
          status: 409,
          errCode: 409,
          errMessage: 'Existing user with the email.'
        };
        return userData;
      }

      let holderStore = await managerUser.findOne(User, { where: { _id: new ObjectId(UpdateData.id) } });
      if (holderStore && holderStore.delFlg != -1) {
        let can_edit_email = 'EDIT'+UpdateData.email;
        const redis = RedisConnection.getInstance();

        const checkRedis = await redis.getValue(can_edit_email)
        await redis.deleteValue(can_edit_email);
        if(!(checkRedis.value) &&  UpdateData.email !== holderStore.email){
          userData = {
              status: 400,
              errCode: 400,
              errMessage: `You can not update email`
            };
          return userData;
        }
        
        const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
            // Điều kiện tìm kiếm
            { _id: new ObjectId(UpdateData.id) },
            // Cập nhật dữ liệu
            {
              $set: {
                name : UpdateData.fullName,
                phone: UpdateData.phone || holderStore.phone || '',
                email : UpdateData.email, 
                gender : UpdateData.gender || holderStore.gender || '',
                dateOfBirth: UpdateData.birthday || holderStore.dateOfBirth ,
                avatar: UpdateData.urlAvatar || holderStore.avatar,
              }
            }
          );
          userData = {
            status: 200,
            errCode: 200,
            errMessage: 'User update successfully.',
            userInfor: {
              name: UpdateData.fullName || holderStore.name,
              phone: UpdateData.phone || holderStore.phone,
              birthday: UpdateData.birthday || holderStore.dateOfBirth,
              email: UpdateData.email,
              avatar: UpdateData.urlAvatar || holderStore.avatar,
              gender: UpdateData.gender || holderStore.gender,
              id: UpdateData.id,
              role: 'user'
            }            
          };
      } else {
        userData = {
          status: 400,
          errCode: 400,
          errMessage: `Not found user had id is ${UpdateData.id}`
        };
      }
      return userData
    } catch (error) {
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      return userData;
    }
  };

  // upload image by id
  updateImage = async (urlAvatar: string, id: string): Promise<UserData> => {
    try {
      let userData: UserData;

      if (!ObjectId.isValid(id)) {
        const userData = {
          status: 500,
          errCode: 500,
          errMessage: 'Internal error - id not support'
        };
        console.error('error id');
        return userData;
      }
      const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
        // Điều kiện tìm kiếm
        { _id: new ObjectId(id) },
        // Cập nhật dữ liệu
        {
          $set: {
            urlAvatar: urlAvatar
          }
        },
        { returnDocument: 'after' }
      );
      console.log('32');

      if (user && user.value) {
        console.log(user);
        const imageUrl = await instanceStorageFireball.deleteImage(user.value?.urlAvatar);

        userData = {
          status: 200,
          code: 200,
          message: `Update success avatar user.`,
          userInfor: {
            name: user.value?.name,
            address: user.value?.address,
            email: user.value?.email,
            gender: user.value?.gender,
            id: user.value?.id,
            role: 'user',
            avatar: urlAvatar
          }
        };
        return userData;
      } else {
        const imageUrl = await instanceStorageFireball.deleteImage(urlAvatar);
        console.log(imageUrl);
        // logger.info(`Remove image in link ${urlAvatar}`)
        userData = {
          status: 400,
          errCode: 400,
          errMessage: `Not found user with id ${id}`
        };
        return userData;
      }
    } catch (error) {
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      console.error(error);
      return userData;
    }
  };
  // update status

  removeUser = async (id: string, password: string): Promise<UserData> => {
    try {
      let userData: UserData;

      console.log(id);

      if (!ObjectId.isValid(id)) {
        const userData = {
          status: 500,
          errCode: 500,
          errMessage: 'Internal error - id not support'
        };
        console.error('error id');
        return userData;
      }

      let holderStore = await managerUser.findOne(User, { where: { _id: new ObjectId(id) } });
      console.log(holderStore?.delFlg);
      // if exist return, not exist, continue to next step
      if (holderStore) {
        let isMatch = await bcrypt.compare(password, holderStore.password);
        if (isMatch) {
          const tour = await managerUser.getMongoRepository(User).findOneAndUpdate(
            // Điều kiện tìm kiếm
            { _id: new ObjectId(id) },
            // Cập nhật dữ liệu
            {
              $set: {
                delFlg: -1
              }
            }
          );
          if (tour) {
            userData = {
              status: 200,
              errCode: 200,
              errMessage: `Remove user successfully `,
              userInfor: tour || {}
            };
          } else {
            userData = {
              status: 400,
              errCode: 400,
              errMessage: `Not found`
            };
          }
          return userData;
        } else {
          const userData = {
            status: 400,
            errCode: 400,
            errMessage: 'Wrong password'
          };
          return userData;
        }
      } else {
        const userData = {
          status: 400,
          errCode: 400,
          errMessage: 'No user'
        };
        return userData;
      }
    } catch (error) {
      const userData = {
        status: 500,
        errCode: 500,
        errMessage: 'Internal error'
      };
      return userData;
    }
  };

  checkEmailExist = async (email: string): Promise<boolean> => {
    try {
      let holderStore = await managerUser.findOne(User, { where: { email } });
      if (holderStore) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
}

export default new UsersService();
