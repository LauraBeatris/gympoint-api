import { addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';

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
      const { duration, price } = await Plan.findByPk(plan_id);
      newPrice = duration * price;
      end_date = addMonths(registration.start_date, duration);
    }

    // Updating and saving
    const { id, start_date, student_id } = await registration.update(data);
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
