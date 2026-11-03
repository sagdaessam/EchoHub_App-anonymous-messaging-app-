import { AppError } from "../error/error.js";
import jwt from "jsonwebtoken";
import {env} from "../config/env.js";

export function authGuard(req , res, next){
    try{
        //logic of check token 
        const token = req.cookies.access_token;
        if(!token) throw new AppError("No Token Provider" , 403);
        req.user = jwt.verify(token, env.jwt.secret);
        // req.user = payload;
        next();
    }catch(error){
        next(error);
    }
}