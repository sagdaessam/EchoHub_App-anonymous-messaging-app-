import { toMs } from '../../../common/utils/time.js';
import * as authService from '../service/auth.service.js';
import { validateBody } from '../../../common/validation/validation.js';
import { registerDTO , verifyAccountDTO , loginDTO , sendOTPDTO , resetPasswordDTO } from '../dto/auth.dto.js';


export async function register(req , res , next){
    try{
        const data = validateBody(registerDTO , req.body);
        const createdUser = await authService.register(data);
        res.status(201).json({
            message : "User Created Successfully .",
            success : true,
            data : createdUser
        });
    }catch(error){
        next(error);
    }
}

export async function verifyAccount(req , res , next){
    try{
        const data = validateBody(verifyAccountDTO , req.body);
        const {email, code} = data;
        const updatedUser = await authService.verifyAccount(email , code);
        res.status(201).json({
            message : "User Verified Successfully.",
            success : true,
            data : updatedUser
        });
    }catch(error){
        next(error);
    }
}

export async function login(req , res , next){
    try{
        const data = validateBody(loginDTO , req.body);
        const {email, password} = data;
        const token = await authService.login(email , password);
        res.cookie('access_token' , token , {
            httpOnly: true,
            maxAge : toMs(1 , 'hours')
        });
        res.status(201).json({
            message : "User Login Successfully.",
            success : true,
        });
    }catch(error){
        next(error);
    }
}

export async function sendOtp(req , res , next){
    try{
        const data = validateBody(sendOTPDTO , req.body);
        const {email} = data;
        await authService.sendOtp(email);
        res.status(201).json({
            message : "New otp sent, check user email.",
            success : true,
        });
    }catch(error){
        next(error);
    }
}

export async function resetPassword(req , res , next){
    try{
        const data = validateBody(resetPasswordDTO , req.body);
        const {email , code , newPassword} = data;
        await authService.resetPassword(email , code , newPassword);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
}
