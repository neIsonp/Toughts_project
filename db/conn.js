const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

try {

    sequelize.authenticate();
    console.log('connected!');

} catch (error) {

    console.log(err);
}

module.exports = sequelize;