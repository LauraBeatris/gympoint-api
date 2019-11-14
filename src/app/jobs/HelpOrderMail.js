import Mail from '../../lib/Mail';

class RegistrationEmail {
  // Returning a unique key
  get key() {
    return 'RegistrationEmail';
  }

  // Handling the job -> Using nodemailer to send the registration email
  async handle(data) {
    console.log('hey');
    console.log('data', data);
    // await Mail.sendEmail({})
  }
}

export default new RegistrationEmail();
