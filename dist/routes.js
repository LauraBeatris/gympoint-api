"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');

var _UserController = require('./app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);
var _SessionController = require('./app/controllers/SessionController'); var _SessionController2 = _interopRequireDefault(_SessionController);
var _StudentController = require('./app/controllers/StudentController'); var _StudentController2 = _interopRequireDefault(_StudentController);

var _PlansController = require('./app/controllers/PlansController'); var _PlansController2 = _interopRequireDefault(_PlansController);
var _RegistrationController = require('./app/controllers/RegistrationController'); var _RegistrationController2 = _interopRequireDefault(_RegistrationController);
var _CheckinController = require('./app/controllers/CheckinController'); var _CheckinController2 = _interopRequireDefault(_CheckinController);

var _StudentQuestionController = require('./app/controllers/StudentQuestionController'); var _StudentQuestionController2 = _interopRequireDefault(_StudentQuestionController);
var _AnswerOrderController = require('./app/controllers/AnswerOrderController'); var _AnswerOrderController2 = _interopRequireDefault(_AnswerOrderController);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);

const routes = new (0, _express.Router)();

// Creating users, sessions
routes.post('/users', _UserController2.default.store);
routes.post('/sessions', _SessionController2.default.store);

// Creating and listing checkins for an specific user
routes.post('/students/:student_id/checkins', _CheckinController2.default.store);
routes.get('/students/:student_id/checkins', _CheckinController2.default.index);

// Creating and listing questions of help orders for an specific user
routes.post(
  '/students/:student_id/help-orders',
  _StudentQuestionController2.default.store
);
routes.get(
  '/students/:student_id/help-orders',
  _StudentQuestionController2.default.index
);

routes.use(_auth2.default);

// Creating and updating students
routes.post('/students', _StudentController2.default.store);
routes.put('/students/:student_id', _StudentController2.default.update);

// Updating users
routes.put('/users', _UserController2.default.update);

// Creating, updating, deleting and listing plans
routes.post('/plans', _PlansController2.default.store);
routes.put('/plans/:plan_id', _PlansController2.default.update);
routes.delete('/plans/:plan_id', _PlansController2.default.delete);
routes.get('/plans', _PlansController2.default.index);

// Creating, updating, deleting and listing registrations
routes.post('/registrations', _RegistrationController2.default.store);
routes.put('/registrations/:registration_id', _RegistrationController2.default.update);
routes.delete('/registrations/:registration_id', _RegistrationController2.default.delete);
routes.get('/registrations', _RegistrationController2.default.index);

// Answering questions of help orders from students
routes.post('/help-orders/:question_id/answer', _AnswerOrderController2.default.store);

// Listing question that aren't answered yet
routes.get('/help-orders/pending', _AnswerOrderController2.default.index);

exports. default = routes;
