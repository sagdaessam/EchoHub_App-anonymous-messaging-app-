import { OAuth2Client } from "google-auth-library";
import { AppError } from "../error/error.js";
import { env } from "../config/env.js";


const client = new OAuth2Client();

export async function verifyGoogleIdToken(idToken){
    try{
        const ticket = await client.verifyIdToken({idToken: idToken , audience: env.google.webClientId });
        return ticket.getPayload();
    }catch(error){
        throw new AppError('Invalid Google ID token' , 403);
    }
}