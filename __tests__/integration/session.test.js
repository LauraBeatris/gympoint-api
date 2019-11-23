import request from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import truncate from '../util/truncate';
import User from '../../src/app/models/User';

describe('Session', () => {
  beforeEach(async () => {
    // Deleting all of the old the registers before run each test
    await truncate();
  });

  test('should create an session successfully', () => {});

  test("shouldn't create an session with an user that not exists", () => {});

  test("shoudn't create an session with an user that not match her/his current password data", () => {});
});
