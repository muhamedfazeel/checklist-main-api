import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  localhost: process.env.LOCALHOST,
  logger: {
    level: process.env.LOGGER_LEVEL,
    prettyPrintLog: process.env.PRETTY_PRINT_LOG,
  },
  swaggerServer: process.env.SWAGGER_SERVER,
  devServerUrl: process.env.DEV_SERVER_URL,
  db: {
    read: {
      host: process.env.DB_READ_HOST,
      port: process.env.DB_READ_PORT,
      database: process.env.DB_READ_NAME,
      username: process.env.DB_READ_USERNAME,
      password: process.env.DB_READ_PASSWORD,
      dbHost: process.env.DB_READ_HOST,
    },
    write: {
      host: process.env.DB_WRITE_HOST,
      port: process.env.DB_WRITE_PORT,
      database: process.env.DB_WRITE_NAME,
      username: process.env.DB_WRITE_USERNAME,
      password: process.env.DB_WRITE_PASSWORD,
      dbHost: process.env.DB_WRITE_HOST,
    },
  },
  maxLoginLimit: process.env.ACE_POINT_MAX_LOGIN_LIMIT,
}));
