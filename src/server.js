import http from 'http';
import { createApp } from './app.js';
import { env } from './lib/config/env.js';
import mongoose from 'mongoose';
import { logger } from './pkg/logger/logger.js';

const app = createApp();
const server = http.createServer(app);
//env.port
server.listen(env.port , () => logger.info('Server is running on port 8888'));

async function shutdown(){
    server.close(async() => {
        await mongoose.disconnect();
        process.exit(0);
    });
}

//SIGINT by hand SIGTERM by docker
process.on('SIGINT', shutdown);

process.on('SIGTERM' , shutdown);