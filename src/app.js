import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

import './database';

dotenv.config({
  path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env',
});

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV !== 'production';

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Ready to receive request bodies in JSON format
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
