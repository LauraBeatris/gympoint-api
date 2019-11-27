import database from '../../src/database';

export default async function truncate(choosedModel) {
  return await Promise.all(
    Object.keys(database.connection.models).map(key => {
      if (key === 'User' || key === choosedModel){
        return database.connection.models[key].destroy({
          truncate: true,
          force: true,
        });
      }
    })
  );
}
