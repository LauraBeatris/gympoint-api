import express from 'express';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';

import './database';

dotenv.config({
  path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env',
});

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV !== 'production';

    // Initializing Sentry
    if (this.isDev) Sentry.init(process.env.SENTRY_DSN);

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    // Ready to receive request bodies in JSON format
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    if (process.env.NODE_ENV === 'production') {
      this.server.use(Sentry.Handlers.errorHandler());
    }
  }

  exceptionHandler() {
    // Middleware responsable for handling exceptions

    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;
