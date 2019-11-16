const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env',
});

module.exports = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
