import Mail from '../../lib/Mail';

class RegistrationEmail {
  // Returning a unique key
  get key() {
    return 'RegistrationEmail';
  }

  async handle({ data }) {
    const { start_date, end_date, price, student } = data;
    return Mail.sendEmail({
      to: `<${student.email}>`, // An array if you have multiple recipients.
      subject: 'Registration',
      template: 'registration_confirm',
      context: {
        student: student.name,
        price,
        end_date,
        start_date,
      },
    });
  }
}

export default new RegistrationEmail();
