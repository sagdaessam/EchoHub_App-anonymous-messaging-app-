import {AppError} from '../../common/error/error.js';

export const  otpExpired = new AppError('Otp Expired, please resend OTP.' , 404);

export const  invalidCode = new AppError('Invalid code.' , 400);

export const  invalidPassword = new AppError('invalid Password.' , 403);
