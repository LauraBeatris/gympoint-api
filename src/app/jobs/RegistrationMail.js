import Mail from '../../lib/Mail';

class RegistrationEmail {
  // Returning a unique key
  get key() {
    return 'RegistrationEmail';
  }

  // Handling the job -> Using nodemailer to send the registration email
  async handle(data) {
    await Mail.sendEmail({
      to: 'laurabeatriserafim@gmail.com', // An array if you have multiple recipients.
      subject: 'Hey you, awesome!',
      html: '<b>Wow Big powerful letters</b>',
      text: 'Mailgun rocks, pow pow!',
    });
  }
}

export default new RegistrationEmail();
