import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const redisConfig = {
  host: '127.0.0.1',
  port: 6379,
};

export default redisConfig;
