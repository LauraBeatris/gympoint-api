require('../bootstrap');

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  storage: './__tests__/database.sqlite',
  logging: !process.env.DB_DIALECT,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
