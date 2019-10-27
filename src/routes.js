import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ msg: 'Testing' }));

export default routes;
