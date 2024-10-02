'use strict'

import { AppDataSource } from '../databases/connectDatabase';
import { TourData } from '../databases/interface/tourInterface';
const managerTour = AppDataSource.mongoManager;
import { Tour } from '../databases/models/entities/Tour';
import { ObjectId } from 'mongodb';
// firebase
import { v4 as uuidv4 } from "uuid";
import { logger } from '../log';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storageData } from '../databases/firebase/firebase.init';
import { validate } from 'class-validator';
import { number } from 'joi';
class UsersService {

}

export default new UsersService();