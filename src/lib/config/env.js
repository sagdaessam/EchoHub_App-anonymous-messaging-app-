//schema >> validate data process.env
import nodemailer from 'nodemailer';
import mailjet from "node-mailjet";
import {z} from 'zod';
import {config} from 'dotenv';
config();


const schema = z.object({
    PORT: z.string().default('8888'),

    MONGODB_URL: z.string(),

    JWT: z.string(),

    MAIL_USER: z.string().trim().toLowerCase(),
    MAIL_PASS: z.string(),

    GOOGLE_OAUTH_CLIENT_ID: z.string(),

    REDIS_PORT: z.string().default('6379'),
    REDIS_HOST: z.string(),
    REDIS_PASSWORD: z.string(),

    MAILJET_API_KEY: z.string(),
    MAILJET_API_SECRET : z.string(),
    MAILJET_FROM_EMAIL: z.string(),
    MAILJET_FROM_NAME: z.string(),

});

const parsed = schema.parse(process.env);

export const env = {
    port: Number(parsed.PORT),
    db:{
        url: parsed.MONGODB_URL
    },
    google:{
        webClientId: parsed.GOOGLE_OAUTH_CLIENT_ID,
        iosClientId: parsed.GOOGLE_OAUTH_CLIENT_ID,
    },
    redis:{
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD
    },
    nodemailer:{
        user: parsed.MAIL_USER,
        pass: parsed.MAIL_PASS
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME,
    },
    jwt:{
        secret: parsed.JWT
    },
    payments:{},
    aws:{ }

}