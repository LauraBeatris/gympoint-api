import kue from 'kue';
import Sentry from '@sentry/node';
import redisConfig from '../config/redis';

import RegistrationMail from '../app/jobs/RegistrationMail';

const jobs = [RegistrationMail];

class Queue {
  constructor() {
    this.queue = kue.createQueue({ redis: redisConfig });

    this.processQueue();
  }

  processQueue() {
    jobs.forEach(job => this.queue.process(job.key, job.handle));

    if (Sentry) {
      this.queue.on('error', Sentry.captureException);
    }
  }
}

export default new Queue().queue;
