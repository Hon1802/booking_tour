import dotenv from 'dotenv';
dotenv.config();
export const port = process.env.PORT || 3000;
export const mongoURL = process.env.MONGO_URI || 'no url';
export const salt_rounds = 'kamenriderDECADE';
export const jwt_secret = 'this is jwt serect';
