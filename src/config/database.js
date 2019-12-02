require('../bootstrap');

const config = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  storage: './__tests__/database.sqlite',
<<<<<<< HEAD
=======
  logging: false,
>>>>>>> 6b0ea6d1f9424e344dce14befb62d1c82685d064
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

if (process.env.DB_DIALECT)
  config.retry = {
    max: 10,
  };

module.exports = config;
