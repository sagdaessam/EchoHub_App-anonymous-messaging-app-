import 'dotenv/config';
// import {config} from 'dotenv'
//loading
// config();
import "./common/db/mongoose.js";
import express from "express" ;
import authRouter from "./app/auth/auth.route.js";
import messageRouter from "./app/message/message.route.js";
import userRouter from "./app/user/user.route.js";
// import AppError from '../../common/error/error.js';
import {logger } from './common/logger/logger.js';




const app = express();

app.use(express.json());

//routes
app.use("/auth",authRouter);
app.use("/message",messageRouter);
app.use("/user",userRouter);







app.use((err, req, res ,next) =>{
    logger.error(err.message , err);
    if(err.isOperational === true){
        return res.status(err.statusCode).json({
        message: err.message,
        success: false,
        // stack: err.stack
        });
    }
    return res.status(500).json({
        error : 'Something went wrong',
        success : false
    });
})



app.listen(8888 , () => logger.info("Server Starts On Port 8888"));

