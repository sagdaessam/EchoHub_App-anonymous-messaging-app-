import 'dotenv/config';
// import {config} from 'dotenv'
//loading
// config();
import "./common/db/mongoose.js";
import express from "express" ;
import authRouter from "./app/auth/auth.route.js";
import messageRouter from "./app/message/message.route.js";
import userRouter from "./app/user/user.route.js";



const app = express();

app.use(express.json());

//routes
app.use("/auth",authRouter);
app.use("/message",messageRouter);
app.use("/user",userRouter);







app.use((err, req, res ,next) =>{
    res.json({
        message: err.message,
        success: false,
        stack: err.stack
    })
})



app.listen(8888 , () => console.log("Server Starts On Port 8888"));

