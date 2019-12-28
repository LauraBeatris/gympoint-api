import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import redis from 'redis';

const config = new RateLimit({
  // Configuring the redis storage
  store: new RateLimitRedis({
    client: redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  }),
  // Miliseconds interval to verify the amount of requests
  windowMs: 1000 * 60 * 15,
  // The max amount of requests between the interval up above
  max: 200,
});

export default config;
