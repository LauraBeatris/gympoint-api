module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('registrations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'plans',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('registrations');
  },
};
