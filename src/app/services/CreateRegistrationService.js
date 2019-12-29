import { parseISO, addMonths, format } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class CreateRegistrationService {
  async run({ plan_id, student_id, start_date }) {
    // Finding for the choosed plan
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      throw new Error('Plan not found');
    }

    const { price: planPrice, duration } = plan;

    // Generating the end date and the price based on the choosed plan
    start_date = parseISO(start_date);
    const end_date = addMonths(start_date, duration);
    const price = planPrice * duration;

    // Verifying if the user already have a registration
    const existingRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (existingRegistration) {
      throw new Error(
        JSON.stringify({
          err:
            'This student already have a registration. Update the current one or delete',
          contentMessage: 'Esse aluno já possui uma matrícula',
        })
      );
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      throw new Error(
        JSON.stringify({
          err: 'Student not found',
          contentMessage: 'Aluno não encontrado',
        })
      );
    }

    const { id } = await Registration.create({
      start_date,
      end_date,
      price,
      plan_id,
      student_id,
    });

    await Queue.add(RegistrationMail.key, {
      start_date: format(start_date, "'At day' dd 'of' MMMM',' H:mm 'hours'"),
      end_date: format(end_date, "'At day' dd 'of' MMMM',' H:mm 'hours'"),
      price,
      plan,
      student,
    });

    return { id, start_date, end_date, price, plan, student_id };
  }
}

export default new CreateRegistrationService();
