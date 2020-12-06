import { config } from 'dotenv';
config();

export default {
  port: process.env.PORT,
  databaseConnection: process.env.DB_CONNECTION,
  jwtSecret: process.env.TOKEN_SECRET,
  pepper: process.env.PEPPER
}