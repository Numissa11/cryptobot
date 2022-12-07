// Update with your config settings.

module.exports = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: '3307',
    database: 'cryptodb',
    user:     'user',
    password: 'motDePasseHabituelEnMinuscule'
  },
  migrations: {
    tableName: 'migrations',
    directory: './migrations'
  }
};
