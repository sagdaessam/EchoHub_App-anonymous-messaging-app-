import * as authRepository from '../repository/auth.repository.js';
import * as otpRepository from '../repository/otp.repository.js';
import * as userRepository from '../../user/repository/user.repository.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendEmail } from '../../../common/email/nodemailer.js';
import { toMs } from '../../../common/utils/time.js';
import { invalidCode , invalidPassword , otpExpired } from '../errors.js';
import { userAlreadyExist , userAlreadyVerified , userNotExist , userNotVerified } from '../../user/errors.js';
import { generateOTP } from '../../../common/utils/otp.js';




export async function register(userData){
    // 1. check user existence
    const userExist = await authRepository.checkUserExitByEmail(userData.email);
    // 2. if yes throw error
    if(userExist) throw userAlreadyExist;
    // 3. hash password
    userData.password = await bcrypt.hash(userData.password , 10);
    // 4. save user into db
    const createdUser = await authRepository.createUser(userData);
    // 5. generate and save otp into db
    const code = generateOTP();
    await otpRepository.createOTP({
        code:code,
        email:userData.email,
        expiresAt: new Date(Date.now() + toMs(5 ,'minutes'))
    }); 
    // 6.  send email verification otp
    sendEmail(userData.email , 'verification code' , `<h1>Your verification code is ${otp} </h1>`);
    return createdUser;
}


export async function verifyAccount(email, code){
    //1. check user existence
    const user = await authRepository.checkUserExitByEmail(email);
    //1.1 if you dont exist >> error
    if(!user) throw userNotExist;
    //1.2 if isVerified = true >> error
    if(user.isVerified === true) throw userAlreadyVerified;
    //2. check otp validation
    const otp = await otpRepository.getOtpByEmail(email);
    //2.1 not exist into db >> error >> otp expired
    if(!otp) throw otpExpired;
    //2.2 otp stored into db >> code not equal code stored >> error >> otp invalid
    if(otp.code !== code) throw invalidCode;
    //3. switch your isVerified to true [update user]
    const updatedUser = await userRepository.updateUserByEmail(email, {isVerified: true});
    //4. delete otp from db
    await otpRepository.deleteOTPsByEmail(email);

    return updatedUser;
}


export async function login(email, password){
    // 1. check user existence
    const user = await authRepository.checkUserExitByEmail(email);
    // 1.1 if you dont exist >> error
    if(!user) throw userNotExist;
    // 1.2 if isVerified = true >> error
    if(user.isVerified === false) throw userNotVerified;
    //2. compare password
    const match = await bcrypt.compare(password , user.password);
    if (!match) throw invalidPassword;
    //3. generate access token
    const token = await jwt.sign(
        {id : user._id, email: user.email, name: user.name} ,
        process.env.JWT,
        {expiresIn: toMs(1 , 'hours')}
    );
    return token;
    
}

export async function sendOtp(email){
    //1. check  user Existence
    const user = await authRepository.checkUserExitByEmail(email);
    if(!user) throw userNotExist;
    //2. delete all old OTPs
    await otpRepository.deleteOTPsByEmail(email);
    //3. generates OTP and save it into DB
    const code = generateOTP();
    await otpRepository.createOTP({
        code : code,
        email : email,
        expiresAt : Date.now() + toMs(3 , 'minutes')
    });
    //4. send otp email
    await sendEmail(email , 'new otp' , `<p>Your new otp is ${code}</p>`);
}