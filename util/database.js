const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-course', 'root', '20202020',
 {dialect: 'mysql', host: 'localhost'});

 module.exports = sequelize;