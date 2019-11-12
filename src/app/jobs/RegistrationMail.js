import Mail from '../../lib/Mail';

class RegistrationEmail {
  // Returning a unique key
  get key() {
    return 'RegistrationEmail';
  }

  // Handling the job -> Using nodemailer to send the registration email
  async handle(data, done) {
    console.log(data);

    // await Mail.sendEmail({})

    return done();
  }
}

export default new RegistrationEmail();
