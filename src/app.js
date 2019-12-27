import './bootstrap';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';

import RateLimit from './lib/RateLimit';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV === 'development';

    // Initializing Sentry
    if (!this.isDev) Sentry.init(process.env.SENTRY_DSN);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    if (process.env.NODE_ENV !== 'development') {
      // The request handler must be the first middleware on the app
      this.server.use(Sentry.Handlers.requestHandler());

      if (process.env.NODE_ENV !== 'production') {
        /*
        Using helmet middleware to prevent security issues related to the amount of
        requests in the authentication route
      */
        this.server.use(helmet());

        /*
       Using rate limit to prevent security issues - related to the amount of requests
       in the rest of the app routes
     */
        this.server.use(RateLimit);
      }
    }

    // TODO -> Set address of the application
    // this.server.use(cors({origin: 'https://somename.com'}));
    this.server.use(cors());

    // Ready to receive request bodies in JSON format
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    if (process.env.NODE_ENV !== 'development') {
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
