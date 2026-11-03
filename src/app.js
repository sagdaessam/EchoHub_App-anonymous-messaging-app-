
import "./lib/db/mongoose.js";
import express from "express" ;
import cors from 'cors';
import { router } from "./route.js";
import { globalErrorHandler } from "./lib/error/error.handler.js";
import {logger } from './pkg/logger/logger.js';
import { correlationId } from "./pkg/correlation/correlationId.js";
import cookieParser from "cookie-parser";
import {rateLimit} from 'express-rate-limit';
import { toMs } from "./pkg/utils/time.js";
import { AppError } from "./lib/error/error.js";


export function createApp(){
    const app = express();

  const limiter =  rateLimit({
      limit: 3, 
      windowMs: toMs(1, 'minutes'),
      standardHeaders: "draft-7",
      handler: function(req, res, next){
        next(new AppError(this.message , this.statusCode));
      },
  });

  app.use(limiter);

  app.use(cors({origin: 'http://localhost:4200'}));

  //get static files
  app.use('/uploads', express.static('uploads'));

  //parse incoming requests body raw json buffer to object 
  app.use(express.json());

  // parsing cookies
  app.use(cookieParser());

  app.use(correlationId);

app.get('/health', (req, res, next) => {
  console.log('server is HIT');
  res.json( 'ok');
});

  //routes
  app.use("/api",router);

  app.use(globalErrorHandler);

return app;
}

