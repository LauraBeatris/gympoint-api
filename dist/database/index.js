"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);
var _Student = require('../app/models/Student'); var _Student2 = _interopRequireDefault(_Student);
var _Plan = require('../app/models/Plan'); var _Plan2 = _interopRequireDefault(_Plan);
var _Registration = require('../app/models/Registration'); var _Registration2 = _interopRequireDefault(_Registration);
var _Checkin = require('../app/models/Checkin'); var _Checkin2 = _interopRequireDefault(_Checkin);
var _HelpOrder = require('../app/models/HelpOrder'); var _HelpOrder2 = _interopRequireDefault(_HelpOrder);

const models = [_User2.default, _Student2.default, _Plan2.default, _Registration2.default, _Checkin2.default, _HelpOrder2.default];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new (0, _sequelize2.default)(_database2.default);

    // Passing the database connection to the init method of the models
    models.map(model => model.init(this.connection));

    // Filtering the models that have relationships
    const associatedModels = models.filter(
      model => typeof model.associate === 'function'
    );

    // Passing all the connected models
    associatedModels.map(model => model.associate(this.connection.models));
  }
}

exports. default = new Database();
