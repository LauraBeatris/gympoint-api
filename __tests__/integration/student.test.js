import request from 'supertest';

import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';

describe('Student', () => {
  beforeEach(async () => {
    // Deleting all of the old the registers before run each test
    await truncate();
  });

  it('should succesfully create a student', async () => {});

  it('should succesfully update a student', async () => {});

  it("shouldn't create a student with an email that already exists", async () => {});

  it("shouldn't update a student with an email that already exists", async () => {});

  it('should pass the student id', async () => {});
});
