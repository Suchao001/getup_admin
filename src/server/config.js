import knexlib from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const knex = knexlib({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export default knex;
