import { Sequelize } from 'sequelize';
import fs from 'fs';

const dbConfig = JSON.parse(fs.readFileSync('/opt/nodejs/config/config.json', 'utf-8')).development;


const sequelize = new Sequelize({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    freezeTableName: true
  }
});

export default sequelize;