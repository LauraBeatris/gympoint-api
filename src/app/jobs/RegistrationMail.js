import Mail from '../../lib/Mail';

class RegistrationEmail {
  // Returning a unique key
  get key() {
    return 'RegistrationEmail';
  }

  // Handling the job -> Using nodemailer to send the registration email
  async handle(data) {
    return Mail.sendEmail({
      to: 'laurigdm@gmail.com', // An array if you have multiple recipients.
      subject: 'Testingletters</b>',
      text: 'Email about job',
    });
  }
}

export default new RegistrationEmail();
