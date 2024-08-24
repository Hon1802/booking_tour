'use strict'
import jwt from 'jsonwebtoken';
import { logger } from '../log';

// payload
interface Payload {
    userId?: string | undefined;
    email?: string | undefined;
}
const createTokenPair = async (
    payload: Payload,
    publicKey: string, 
    privateKey: string)=>{
    try{
        const accessToken = await jwt.sign( payload, privateKey,{
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await jwt.sign( payload, privateKey,{
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        //  verify
        jwt.verify( accessToken, publicKey, (err, decode)=>{
            if(err)
            {
                logger.error('error verify', err)
            }else{
                logger.info('decode verify', decode)
            }
        })
        return {
            accessToken,
            refreshToken
        }

    }catch(err)
    {
        logger.error('createTokenPair err', err)
    }
}
export default createTokenPair;