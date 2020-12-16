import { config } from 'dotenv';
config();

export default {
  databaseConnection: process.env.DB_CONNECTION,
  databaseUser: process.env.MONGO_INITDB_ROOT_USERNAME,
  databasePassword: process.env.MONGO_INITDB_ROOT_PASSWORD
}