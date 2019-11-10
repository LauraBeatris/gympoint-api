import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Registration from '../app/models/Registration';

const models = [User, Student, Plan, Registration];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

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

export default new Database();
