'use strict'

// lodash
import _ from 'lodash';

import { AppDataSource } from '../databases/connectDatabase';
const managerUser = AppDataSource.mongoManager;
import { User } from '../databases/models/entities/User';
import { ObjectId } from 'mongodb';
// firebase
import { v4 as uuidv4 } from "uuid";
import { logger } from '../log';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import instanceStorageFireball, { storageData } from '../databases/firebase/firebase.init';
import { validate } from 'class-validator';
import { number } from 'joi';
import { UserData } from '../databases/interface/userInterface';
import bcrypt from 'bcrypt';
import errorCodes from '../common/errorCode/errorCodes';
class UsersService {
    getUserById = async (id: string) : Promise<UserData> => {
        try {
            let userData : UserData;

            if(!ObjectId.isValid(id)){
                userData = {
                    status: 400,
                    errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
                    errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
                };
                logger.error('error id')
                return userData;
            }
            let holderStore = await managerUser.findOne(User, { where: { _id: new ObjectId(id) } });
            if(holderStore)
            {
                if(holderStore.userFlg && holderStore.userFlg === 1)
                {
                    _.set(holderStore, 'role', 'user');
                }

                // Xóa trường 'password' trong holderStore
                const holderStoreWithoutPassword = _.omit(holderStore, ['password', 'delFlg', 'gender','userFlg']);
                
                userData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'Find user',
                    userInfor: holderStoreWithoutPassword || holderStore,
                };
            } else{
                userData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `Not found user had id is ${id}`,
                };
            }
            return userData;
        } catch (error)
        {
            const userData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            return userData;
        }
    }

    // upload image by id
    updateImage = async (urlAvatar:string, id: string) : Promise<UserData> =>{
        try{
            let userData : UserData;

            if(!ObjectId.isValid(id)){
                const userData = {
                    status: 500,
                    errCode: 500,
                    errMessage: 'Internal error - id not support'
                };
                console.error('error id')
                return userData;
            }
            const user = await managerUser.getMongoRepository(User).findOneAndUpdate(
                // Điều kiện tìm kiếm
                { _id: new ObjectId(id) },
                // Cập nhật dữ liệu
                { $set: { 
                    urlAvatar: urlAvatar
                } 
                },
                { returnDocument: 'after' }
              );
              console.log('32')
            
            if(user && user.value)
            {
                console.log(user)
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

            }else{
                const imageUrl = await instanceStorageFireball.deleteImage(urlAvatar);
                console.log(imageUrl)
                // logger.info(`Remove image in link ${urlAvatar}`)
                userData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `Not found user with id ${id}`,
                  };
                  return userData;
            }
        }catch (error)
        {
            const userData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.error(error)
            return userData;
        }
    }
    // update status

    removeUser = async (id: string, password: string) : Promise<UserData> =>{
        try{
            let userData : UserData;

            console.log(id)

            if(!ObjectId.isValid(id)){
                const userData = {
                    status: 500,
                    errCode: 500,
                    errMessage: 'Internal error - id not support'
                };
                console.error('error id')
                return userData;
            }

            let holderStore = await managerUser.findOne(User, { where: { _id: new ObjectId(id) } });
            console.log(holderStore?.delFlg)
            // if exist return, not exist, continue to next step
            if (holderStore ) {
                let isMatch = await bcrypt.compare(password, holderStore.password);
                if(isMatch){
                    const tour = await managerUser.getMongoRepository(User).findOneAndUpdate(
                        // Điều kiện tìm kiếm
                        { _id: new ObjectId(id) },
                        // Cập nhật dữ liệu
                        { $set: { 
                            delFlg: -1
                        } }
                      );
                    if(tour)
                    {
                        userData = {
                            status: 200,
                            errCode: 200,
                            errMessage: `Remove user successfully `,
                            userInfor: tour || {}
                          };
                    }else{
                        userData = {
                            status: 400,
                            errCode: 400,
                            errMessage: `Not found`,
                          };
                    }
                    return userData;
                }
                else{
                    const userData = {
                        status: 400,
                        errCode: 400,
                        errMessage: 'Wrong password'
                    };
                    return userData;
                }
            } else{
                const userData = {
                    status: 400,
                    errCode: 400,
                    errMessage: 'No user'
                };
                return userData;
            }

        }catch (error)
        {
            const userData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            return userData;
        }
    }

    checkEmailExist = async (email: string) : Promise<boolean> => {
        try {            
            let holderStore = await managerUser.findOne(User, { where: { email} });
            if(holderStore)
            {
                return true;
            } else{                
                return false;
            }
        } catch (error)
        {
            return false;
        }
    }
}

export default new UsersService();