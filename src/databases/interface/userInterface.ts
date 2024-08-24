'use strict'
export interface UserData {
  status: number;
  errCode: number;
  errMessage: string | object;
  userInfor?: object; // optional property
  publicKey?: string;
  refreshToken?: string;
  gender?:string
}
export interface userInterface {
  email?: string,
  password?: string
}

export interface Config {
  [key: string]: {
    app: {
      port: string | number;
      salt_rounds: string;
      jwt_secret: string;
    };
    db: {
      host: string;
      port: string;
      name: string;
      url: string;
    
    };
  };
}