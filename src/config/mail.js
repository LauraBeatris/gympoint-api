import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env',
});

export default {
  auth: {
    api_key: process.env.MAILGUN_ACTIVE_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
  default: {
    from: 'Laura Beatris <laurabeatriserafim@gmail.com>',
  },
};
