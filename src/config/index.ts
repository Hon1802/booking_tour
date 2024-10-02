'use strict'
import dotenv from 'dotenv';
import { Config } from "../databases/interface/userInterface";
// import { privateKey, publicKey } from '../auth/key.security';
dotenv.config();
type Environment = 'dev' | 'prod' | 'test'; // Add all possible environments here
import fs from 'fs';
const privateKeyPath = './src/auth/private_key.pem';

const publicKeyPath = './src/auth/public_key.pem';


const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

const config: Config = {
  dev: {
    app:{
        port: process.env.PORT || 3001,
        salt_rounds : process.env.SALT_ROUNDS || 'can not get salt rounds',
        jwt_secret : process.env.JWT_SECRET || 'can not get jwt secret',
        from_email: process.env.EMAIL || '123@gmail.com',
        pass_app_email: process.env.PASS_MAIL_AUTH,
        secret_email: process.env.SECRET_EMAIL || '1111111',
        privateKey: privateKey, 
        publicKey: publicKey
    },
    firebase: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      // databaseURL: process.env.,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    },
    db:{
        host: 'localhost',
        port: '27017',
        name: 'mongodb',
        url: process.env.MONGO_URI || 'no url',
        
    }
  },
  prod: {
    app: {
      port: process.env.PORT || 8080,
       salt_rounds : process.env.SALT_ROUNDS || 'can not get salt rounds',
        jwt_secret : process.env.JWT_SECRET || 'can not get jwt secret',
        from_email: process.env.EMAIL || '123@gmail.com',
        secret_email: process.env.SECRET_EMAIL || '1111111',
        privateKey: privateKey, 
        publicKey: publicKey
    },
    db:{
        host: 'localhost',
        port: '27017',
        name: 'mongodb',
        url: process.env.MONGO_URI || 'no url',
       
    }
  },
  test: {
    app: {
      port: process.env.PORT || 5000,
      salt_rounds : process.env.SALT_ROUNDS || 'can not get salt rounds',
      jwt_secret : process.env.JWT_SECRET || 'can not get jwt secret',
      from_email: process.env.EMAIL || '123@gmail.com',
      secret_email: process.env.SECRET_EMAIL || '1111111',
      privateKey: privateKey, 
      publicKey: publicKey
    },
    db:{
        host: 'localhost',
        port: '27017',
        name: 'mongodb',
        url: process.env.MONGO_URI || 'no url',
        
    }
  },
};

const env: Environment = (process.env.NODE_ENV as Environment) || 'dev';

const currentConfig = config[env];

export default currentConfig;