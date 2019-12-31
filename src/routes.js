import { Router } from 'express';
import { bruteForce } from './lib/Brute';

/*
  Controllers
*/
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import StudentQuestionsController from './app/controllers/StudentQuestionsController';
import AnswerOrderController from './app/controllers/AnswerOrderController';
import AuthMiddleware from './app/middlewares/auth';

/* 
  Validators 
*/
import UserValidator from './app/validators/User';
import SessionValidator from './app/validators/Session';
import AnswerValidator from './app/validators/Answer';
import QuestionValidator from './app/validators/Question';
import PlansValidator from './app/validators/Plan';
import RegistrationValidator from './app/validators/Registration';
import StudentValidator from './app/validators/Student';

const routes = new Router();

// Entry Point Message
routes.get('/', (req, res) =>
  res.send(
    'Welcome to Gympoint API. To access the features, create a user and a session for getting the authorization token. Look into the documentation for more details.'
  )
);

// Creating users, sessions
routes.post('/users', UserValidator.store, UserController.store);

if (process.env.NODE_ENV === 'production') {
  routes.post(
    '/sessions',
    bruteForce.prevent,
    SessionValidator.store,
    SessionController.store
  );
} else {
  routes.post('/sessions', SessionValidator.store, SessionController.store);
}

// Creating and listing checkins for an specific user
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

// Creating and listing questions of help orders for an specific user
routes.post(
  '/students/:student_id/help-orders',
  QuestionValidator.store,
  StudentQuestionsController.store
);
routes.get(
  '/students/:student_id/help-orders',
  StudentQuestionsController.index
);

// Showing the user data
routes.get('/students/:student_id', StudentController.show);

routes.use(AuthMiddleware);

// Showing user data
routes.get('/user', UserController.show);
routes.put('/users', UserValidator.update, UserController.update);

// Creating, updating, deleting, listing
routes.post('/students', StudentValidator.store, StudentController.store);
routes.put(
  '/students/:student_id',
  StudentValidator.update,
  StudentController.update
);
routes.delete('/students/:student_id', StudentController.delete);
routes.get('/students', StudentController.index);

// Creating, updating, deleting and listing plans
routes.post('/plans', PlansValidator.store, PlansController.store);
routes.put('/plans/:plan_id', PlansValidator.update, PlansController.update);
routes.delete('/plans/:plan_id', PlansController.delete);
routes.get('/plans/:plan_id', PlansController.show);
routes.get('/plans', PlansController.index);

// Creating, updating, deleting and listing registrations
routes.post(
  '/registrations',
  RegistrationValidator.store,
  RegistrationController.store
);
routes.put(
  '/registrations/:registration_id',
  RegistrationValidator.update,
  RegistrationController.update
);
routes.delete('/registrations/:registration_id', RegistrationController.delete);
routes.get('/registrations', RegistrationController.index);
routes.get('/registrations/:registration_id', RegistrationController.show);

// Answering questions of help orders from students
routes.post(
  '/help-orders/:question_id/answer',
  AnswerValidator.store,
  AnswerOrderController.store
);

// Listing question that aren't answered yet
routes.get('/help-orders/pending', AnswerOrderController.index);

export default routes;
