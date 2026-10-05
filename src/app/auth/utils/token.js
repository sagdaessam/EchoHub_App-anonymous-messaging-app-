import jwt from 'jsonwebtoken';
import { toMs } from '../../../common/utils/time.js';


export function generateToken(payload){
    return jwt.sign(
        payload,
        process.env.JWT,
        {expiresIn: toMs(1 , 'hours')});
}