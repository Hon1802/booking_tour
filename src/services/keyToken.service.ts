'use strict'

import { ObjectId } from "typeorm";
import { saveToken } from "./userService";

interface CreateKeyTokenParams {
    userId: ObjectId;
    publicKey: any; // Replace `any` with the actual type if known
}
interface KeyToken extends Document {
    userId: ObjectId | undefined;
    publicKey: string | undefined;
}
class KeyTokenServirce{

    static createKeyToken = async ({ userId, publicKey }: CreateKeyTokenParams): Promise<string | null> => {
        try{
            const publicKeyString = publicKey.toString();
            // const tokens = await keyTokenModel.create({
            //     userId: userId,
            //     publicKey: publicKeyString
            // })
            // save public
            const tokens = await saveToken(userId, publicKeyString)
            return publicKeyString;
        } catch(error){
            console.error('Error creating key token:', error); // Log the error for better debugging
            return null; // Return null or handle the error appropriately
        }
    }
} 

export default KeyTokenServirce;