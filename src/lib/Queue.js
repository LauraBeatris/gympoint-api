import kue from 'kue';
import Sentry from '@sentry/node';
import redisConfig from '../config/redis';

class Queue {
  constructor() {
    this.queue = kue.createQueue({ redis: redisConfig });

    this.processQueue();
  }

  processQueue() {
    this.queue.on('error', Sentry.captureException);
  }
}

export default new Queue();
