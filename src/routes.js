import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';

import StudentQuestionController from './app/controllers/StudentQuestionController';
import AnswerOrderController from './app/controllers/AnswerOrderController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

// Creating users, sessions
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Creating and listing checkins for an specific user
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

// Creating and listing questions of help orders for an specific user
routes.post(
  '/students/:student_id/help-orders',
  StudentQuestionController.store
);
routes.get(
  '/students/:student_id/help-orders',
  StudentQuestionController.index
);

routes.use(AuthMiddleware);

// Creating, updating, deleting, listing and showing students
routes.post('/students', StudentController.store);
routes.put('/students/:student_id', StudentController.update);
routes.delete('/students/:student_id', StudentController.delete);
routes.get('/students', StudentController.index);
routes.get('/students/:student_id', StudentController.show);

// Updating users
routes.put('/users', UserController.update);

// Creating, updating, deleting and listing plans
routes.post('/plans', PlansController.store);
routes.put('/plans/:plan_id', PlansController.update);
routes.delete('/plans/:plan_id', PlansController.delete);
routes.get('/plans', PlansController.index);

// Creating, updating, deleting and listing registrations
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:registration_id', RegistrationController.update);
routes.delete('/registrations/:registration_id', RegistrationController.delete);
routes.get('/registrations', RegistrationController.index);

// Answering questions of help orders from students
routes.post('/help-orders/:question_id/answer', AnswerOrderController.store);

// Listing question that aren't answered yet
routes.get('/help-orders/pending', AnswerOrderController.index);

export default routes;
