const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.db_name, process.env.db_username, process.env.db_password, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const configureDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to the MySQL database.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        throw error
    }
}

configureDB()

module.exports = sequelize
