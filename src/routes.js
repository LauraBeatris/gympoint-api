import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import PlansController from './app/controllers/PlansController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

// Creating users, sessions and students
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/students', StudentController.store);

routes.use(AuthMiddleware);

// Updating users and students
routes.put('/users', UserController.update);
routes.put('/students/:student_id', StudentController.update);

// Creating, updating, deleting and listing plans
routes.post('/plans', PlansController.store);
routes.put('/plans/:plan_id', PlansController.update);
routes.delete('/plans/:plan_id', PlansController.delete);
routes.get('/plans', PlansController.index);

export default routes;
