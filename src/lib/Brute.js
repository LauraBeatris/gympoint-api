import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

export const bruteStorage = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

export const bruteForce = new Brute(bruteStorage);
