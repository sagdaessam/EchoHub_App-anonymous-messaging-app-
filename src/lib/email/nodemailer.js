//create transporter
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// establish connection with gmail
const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        // service : 'gmail',
        auth : {
            user : env.nodemailer.user,
            pass : env.nodemailer.pass
        }
});


export async function sendEmail(to , subject , html){
    await transporter.sendMail({
        from : `"EchoHub-App" <${process.env.MAIL_USER}>`,
        to : to ,
        subject : subject,
        html : html
    });
}