import { factory } from 'factory-girl';
import faker from 'faker';

// Models that will be factoried
import User from '../src/app/models/User';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export default factory;
