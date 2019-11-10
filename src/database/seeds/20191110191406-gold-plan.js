module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'Gold',
          duration: 3,
          price: 27.25,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
