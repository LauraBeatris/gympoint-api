const superagent = require('superagent');
const supertest = require('supertest');
const app = require('../../src/app');

const agent = superagent.agent();

exports.login = async (request, done) => {
  const { email, password } = await supertest(app)
    .post('/users')
    .send({ name: 'laura', email: 'laura@gmail.com', password: '123456' });

  const theAccount = {
    email,
    password,
  };

  request
    .post('/sessions')
    .send(theAccount)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};
