 export class AppError extends Error {
    // message;
    // stack ;
    // name ;
    // cause;
    statusCode;
    isOperational;


    constructor(message, statusCode ,isOperational = true){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this , this.constructor);
    }
}

const err = new AppError('message' , 404);