import * as authRepository from '../repository/auth.repository.js';
import * as otpRepository from '../repository/otp.repository.js';
import * as userRepository from '../../user/repository/user.repository.js';
// import bcrypt from "bcrypt";
import crypto from "crypto";
// import jwt from "jsonwebtoken";
import { sendEmail } from '../../../lib/email/nodemailer.js';
import { toMs , toSeconds } from '../../../pkg/utils/time.js';
import { invalidCode , invalidPassword , otpExpired } from '../errors.js';
import { userAlreadyExist , userAlreadyVerified , userNotExist , userNotVerified } from '../../user/errors.js';
import { generateOTP } from '../../../lib/utils/otp.js';
import {logger} from '../../../pkg/logger/logger.js';
import { generateAccessToken , generateRefreshToken } from '../utils/token.js';
import { hashPassword , comparePassword } from '../utils/hash.js';
import { OAuth2Client } from 'google-auth-library';
import { verifyGoogleIdToken } from '../../../lib/utils/google-auth.js'; 
import { mailjetProvider } from '../../../lib/email/init.js';
import { cacheProvider } from '../../../lib/cache/init.js';
import { AppError } from '../../../lib/error/error.js';

//base function 
export async function baseFunction(email, code , factory){
    //1. check user existence
    const user = await authRepository.checkUserExitByEmail(email);
    //1.1 if you dont exist >> error
    if(!user) throw userNotExist;
    //2. check otp validation
    const otp = await cacheProvider.get(`otp:${email}`);
    //2.1 not exist into db >> error >> otp expired
    if(!otp) throw otpExpired;
    //2.2 otp stored into db >> code not equal code stored >> error >> otp invalid
    if(otp !== code) throw invalidCode;
    
    const result = await factory(user);
    //4. delete otp from db
    // await otpRepository.deleteOTPsByEmail(email);
    await cacheProvider.del(`otp:${email}`);
    return result;
}


export async function register(userData){
    // 1. check user existence
    const userExist = await authRepository.checkUserExitByEmail(userData.email);
    // 2. if yes throw error
    if(userExist) throw userAlreadyExist;
    // 3. hash password
    userData.password = await hashPassword(userData.password);
    // 4. save user into db
    const createdUser = await authRepository.createUser(userData);
    // 5. generate and save otp into db
    const code = generateOTP();
    // await otpRepository.createOTP({
    //     code:code,
    //     email:userData.email,
    //     expiresAt: new Date(Date.now() + toMs(5 ,'minutes'))
    // }); 
    await cacheProvider.set(`otp:${email}` , code , toSeconds(3 , 'minutes'));
    // 6.  send email verification otp
    await mailjetProvider.sendMail(userData.email , 'verification code' , `<h1>Your verification code is ${code} </h1>`);
    return createdUser;
}


// export async function verifyAccount(email, code){
//     //1. check user existence
//     const user = await authRepository.checkUserExitByEmail(email);
//     //1.1 if you dont exist >> error
//     if(!user) throw userNotExist;
//     //1.2 if isVerified = true >> error
//     if(user['isVerified'] === true) throw userAlreadyVerified;
//     //2. check otp validation
//     const otp = await cacheProvider.get(`otp:${email}`);
//     //2.1 not exist into db >> error >> otp expired
//     if(!otp) throw otpExpired;
//     //2.2 otp stored into db >> code not equal code stored >> error >> otp invalid
//     if(otp !== code) throw invalidCode;
//     //3. switch your isVerified to true [update user]
//     const updatedUser = await userRepository.updateUserByEmail(email, {isVerified: true});
//     //4. delete otp from db
//     // await otpRepository.deleteOTPsByEmail(email);
//     await cacheProvider.del(`otp:${email}`);

//     return updatedUser;
// }

export async function verifyAccount(email, code){
    await baseFunction(email, code , async () => {
        await userRepository.updateUserByEmail(email, {isVerified: true});
    });
}

export async function enable2stepVerification(email, code){
    await baseFunction(email, code , async () => {
        await userRepository.updateUserByEmail(email, {twoStepVerification: true});
    });
}

export async function verifyCodeToLogin(email, code){
    const {accessToken , refreshToken} = await baseFunction(email, code , async (user) => {
        const jti = crypto.randomUUID();
        const accessToken = generateAccessToken({sub:user._id  , name: user.name });
        const refreshToken = generateRefreshToken({jti:jti , sub:user._id  , name: user.name });
        await cacheProvider.set(`refreshToken:${jti}` , jti , toSeconds(7 , 'days'));
        return {accessToken , refreshToken};
    }); 
    return {accessToken , refreshToken};
}

export async function login(email, password){
    let cachedTries = await cacheProvider.get(`login-tries:${email}`);
    if(cachedTries === '0') throw new AppError('Too Many Requests To Login , Please try again later.', 429);
    // 1. check user existence
    const user = await authRepository.checkUserExitByEmail(email);
    // 1.1 if you dont exist >> error
    if(!user) throw userNotExist;
    // 1.2 if isVerified = true >> error
    if(user.isVerified === false) throw userNotVerified;
    //2. compare password
    const match = await comparePassword(password , user['password']);
    if (!match) throw invalidPassword;

    if(user.twoStepVerification == true){
        const code = generateOTP();
        await cacheProvider.set(`otp:${email}` , code , toSeconds(3 , 'minutes'));
        await mailjetProvider.sendMail(email , '2 step verification email code' , `<h1>Your OTP To Login is ${code} </h1>`);
        return;
    }
    //3. generate access token
        const jti = crypto.randomUUID();
        const accessToken = generateAccessToken({sub:user._id  , name: user.name });
        const refreshToken = generateRefreshToken({jti:jti , sub:user._id  , name: user.name });
        await cacheProvider.set(`refreshToken:${jti}` , jti , toSeconds(7 , 'days'));

        let cachedTTL = await cacheProvider.ttl(`login-tries:${email}`);
        cachedTries = cachedTries ?? 4;
        const ttl = cachedTTL == -2 ? toSeconds(3 , 'minutes') : cachedTTL;
        await cacheProvider.set(`login-tries:${email}` , cachedTries - 1 , toSeconds(3 , 'minutes'));

        return {accessToken , refreshToken};  
}

export async function sendOtp(email){
    //1. check  user Existence
    const user = await authRepository.checkUserExitByEmail(email);
    if(!user) throw userNotExist;
    //2. delete all old OTPs
    await otpRepository.deleteOTPsByEmail(email);
    //3. generates OTP and save it into DB
    const code = generateOTP();
    // await otpRepository.createOTP({
    //     code : code,
    //     email : email,
    //     expiresAt : Date.now() + toMs(3 , 'minutes')
    // });
    await cacheProvider.set(`otp:${(email)}` , code , toSeconds(3 , 'minutes')); 
    //4. send otp email
    await mailjetProvider.sendMail(user.email , 'new otp' , `<p>Your new otp is ${code}</p>`);
}


export async function resetPassword(email , code , newPassword){
    //1. verify otp code
    const otp = await otpRepository.getOtpByEmail(email);
    if(!otp) throw otpExpired;
    if(otp.code !== code) throw invalidCode;
    //2. hash new password
    const hashedPassword = await hashPassword(newPassword);
    //3. update user password
    const updatedUser = await userRepository.updateUserByEmail(email , {password : hashedPassword});
    //4. delete otp from db
    await otpRepository.deleteOTPsByEmail(email);
}


export async function loginWithGoogle(idToken){
        //1. verify idToken
        const payload = await verifyGoogleIdToken(idToken);
        //2. check user existence by email 
        const user = await authRepository.checkUserExitByEmail(payload.email);
        //3. generate access token
        if(user){
            return generateToken({
                id: user._id,
                email: user.email
            });
        }
        //4. if not exist >> create user >> generate token
        const createdUser = await authRepository.createUser({
            name: payload.name,
            email: payload.email,
            provider: 'google',
            isVerified : true
        });
        return generateToken({
            id: createdUser._id,
            email: createdUser.email
        });
}