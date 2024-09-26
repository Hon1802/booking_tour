'use strict'
export interface UserData {
  status: number;
  code?: number;
  errCode?: number;
  errMessage?: string | object;
  message?: string | object;
  userInfor?: object; // optional property
  accessToken?: string;
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
      from_email: string;
      secret_email: string;
      pass_app_email?: string;
      privateKey: string;
      publicKey: string
    };
    firebase?: {
      apiKey?: string,
      authDomain?: string,
      databaseURL?: string,
      projectId?: string,
      storageBucket?: string,
      messagingSenderId?: string,
      appId?: string,
      measurementId?: string,
    };
    db: {
      host: string;
      port: string;
      name: string;
      url: string;
    
    };
  };
}