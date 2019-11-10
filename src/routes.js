import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

// Creating users, sessions
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

// Creating and updating students
routes.post('/students', StudentController.store);
routes.put('/students/:student_id', StudentController.update);

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

export default routes;
