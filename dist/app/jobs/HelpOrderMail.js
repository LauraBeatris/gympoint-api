"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Mail = require('../../lib/Mail'); var _Mail2 = _interopRequireDefault(_Mail);

class HelpOrderMail {
  // Returning a unique key
  get key() {
    return 'HelpOrder';
  }

  // Handling the job -> Using nodemailer to send the registration email
  async handle({ data }) {
    const { email, name, question, answer_at, answer } = data;
    return _Mail2.default.sendEmail({
      to: `<${email}>`,
      subject: 'Your help order was answered',
      template: 'help_order',
      context: {
        student: name || email,
        question,
        answer_at,
        answer,
      },
    });
  }
}

exports. default = new HelpOrderMail();
