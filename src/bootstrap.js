const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'production' && '.env',
});
