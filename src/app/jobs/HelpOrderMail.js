import Mail from '../../lib/Mail';

class HelpOrderMail {
  // Returning a unique key
  get key() {
    return 'HelpOrder';
  }

  // Handling the job -> Using nodemailer to send the registration email
  async handle({ data }) {
    const { email, question, answer_at, answer } = data;
    return Mail.sendEmail({
      to: `<${email}>`,
      subject: 'Your help order was answered',
      template: 'help_order',
      context: {
        student: email,
        question,
        answer_at,
        answer,
      },
    });
  }
}

export default new HelpOrderMail();
