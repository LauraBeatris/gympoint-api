import { addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class UpdateRegistrationService {
  async run({ registration_id, plan_id, data }) {
    // Finding the registration
    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      throw new Error('Registration not found');
    }

    let newPrice = null;
    let end_date = null;

    // If the plan was changed, it needs to change the price and date informations
    if (!!plan_id && plan_id !== registration.plan_id) {
      // Verifyng if the plan exists
      const plan = await Plan.findByPk(plan_id);

      if (!plan) {
        throw new Error('Plan not found');
      }

      const { duration, price } = plan;

      newPrice = duration * price;
      end_date = addMonths(registration.start_date, duration);
    }

    const { student_id } = data;
    /* Verifying if the student exists */
    if (student_id) {
      const student = await Student.findByPk(student_id);
      if (!student) {
        throw new Error('Student not found');
      }

      /* Verifying if the passed student is the same as the current one */

      if (registration.student_id !== student_id) {
        /* Finding if there's an existing registration with that student */
        const registrationExists = await Registration.findOne({
          where: { student_id },
        });

        if (registrationExists)
          throw new Error(
            JSON.stringify({
              err: 'A registration with that student already exists',
              contentMessage: 'Já existe uma matrícula com esse aluno.',
            })
          );
      }
    }

    // Updating and saving
    const { id, start_date } = await registration.update(data);
    await registration.save();

    return {
      id,
      plan_id,
      start_date,
      end_date,
      price: newPrice,
      student_id,
    };
  }
}

export default new UpdateRegistrationService();
