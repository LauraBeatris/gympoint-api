import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/students', StudentController.store);

routes.use(AuthMiddleware);

routes.put('/users', UserController.update);
routes.put('/students/:student_id', StudentController.update);

export default routes;
