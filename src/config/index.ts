'use strict'
import dotenv from 'dotenv';
import { Config } from "../databases/interface/userInterface";
dotenv.config();
type Environment = 'dev' | 'prod' | 'test'; // Add all possible environments here

const config: Config = {
  dev: {
    app:{
        port: process.env.PORT || 3001,
        salt_rounds : process.env.SALT_ROUNDS || 'can not get salt rounds',
        jwt_secret : process.env.JWT_SECRET || 'can not get jwt serect'
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
        jwt_secret : process.env.JWT_SECRET || 'can not get jwt serect'
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
        jwt_secret : process.env.JWT_SECRET || 'can not get jwt serect'
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