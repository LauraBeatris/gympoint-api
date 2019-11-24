import { factory } from 'factory-girl';
import faker from 'faker';

// Models that will be factoried
import User from '../src/app/models/User';
import Student from '../src/app/models/Student';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Student', Student, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  age: faker.random.number(),
  weight: faker.finance.amount(40, 200, 2),
  height: faker.finance.amount(40, 200, 2),
});
export default factory;
