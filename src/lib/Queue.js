import Bee from 'bee-queue';

class Queue {
  constructor() {
    // Each queue of a specific background job
    this.queues = {};

    // Starting the queues
    this.init();
  }

  init() {}

  add() {}

  processQueue() {}

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
