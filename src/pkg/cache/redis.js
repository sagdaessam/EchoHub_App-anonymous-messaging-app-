import Redis from 'ioredis';

export class RedisCacheProvider {
    client;

    // set config - general
    constructor(config){
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password, 
            lazyConnect: true,
            maxLoadingRetryTime: 3
        });

        this.client.on('error', (err) => console.log('Redis server error: ', err.message));
        this.client.connect().catch(err=> console.log('fail to connect to Redis ', err.message));
    }

    async set(key, value, ttl){
        return this.client.set(key, value , 'EX', ttl);
    }

    async get(key ){
        return this.client.get(key);
    }

    async del(key){
        return this.client.del(key);
    }

    async ttl(key){
        return this.client.ttl(key);
    }
}