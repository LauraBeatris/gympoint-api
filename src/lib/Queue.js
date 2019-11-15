import Bee from 'beequeue';
import RegistrationMail from '../app/jobs/RegistrationMail';
import HelpOrderMail from '../app/jobs/HelpOrderMail';
import redisConfig from '../config/redis';

const jobs = [RegistrationMail, HelpOrderMail];

class Queue {
  constructor() {
    // Each queue of a specific background job
    this.queues = {};

    // Starting queues
    this.init();
  }

  init() {
    // Iterating per jobs and storaging the queues with a unique key and the handle for the tasks
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, jobData) {
    // Passing the job data for the specific queue
    // Putting the new task in the queue
    return this.queues[queue].bee.createJob(jobData).save();
  }

  processQueue() {
    jobs.forEach(job => {
      // Accessing the bee queue and the handle method
      const { bee, handle } = this.queues[job.key];

      // Processing the tasks
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
