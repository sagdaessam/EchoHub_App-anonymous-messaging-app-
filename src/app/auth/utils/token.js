import jwt from 'jsonwebtoken';
import { toMs } from '../../../pkg/utils/time.js';
import { env } from '../../../lib/config/env.js';

export function generateAccessToken(payload){
    return jwt.sign(
        payload,
        env.jwt.secret,
        {expiresIn: toMs(1 , 'hours')});
}

export function generateRefreshToken(payload){
    return jwt.sign(
        payload,
        env.jwt.secret,
        { expiresIn: toMs(7, 'days') }
    );
}

// export function verifyRefreshToken(token){
//     return jwt.verify(token , env.jwt.secret);
// }

export function setCookies(res , accessToken , refreshToken){
        res.cookie('access_token' , accessToken , {
            httpOnly: true,
            maxAge : toMs(1 , 'hours')
        });
        res.cookie('refresh_token' , refreshToken , {
            httpOnly: true,
            maxAge : toMs(7 , 'days'),
            path : '/api/auth/refresh-token'
        });
}