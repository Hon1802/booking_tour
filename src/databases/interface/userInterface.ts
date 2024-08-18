export interface UserData {
  status: number;
  errCode: number;
  errMessage: string | object;
  userInfor?: object; // optional property
  accessToken?: string;
  refreshToken?: string;
}
export interface userInterface {
  email?: string,
  password?: string
}
