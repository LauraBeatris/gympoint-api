"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Mail = require('../../lib/Mail'); var _Mail2 = _interopRequireDefault(_Mail);

class RegistrationEmail {
  // Returning a unique key
  get key() {
    return 'RegistrationEmail';
  }

  async handle({ data }) {
    const { start_date, end_date, price, student } = data;
    return _Mail2.default.sendEmail({
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

exports. default = new RegistrationEmail();
