import { registerAs } from '@nestjs/config';

const env = process.env;

export default registerAs('config', () => ({
  server: {
    port: env.PORT || 3000,
    env: env.NODE_ENV || 'development',
    host: env.HOST || 'localhost',
  },
  swagger: {
    server: env.SWAGGER_SERVER,
  },
  log: {
    level: env.LOGGER_LEVEL || 'debug',
    prettyPrint: env.LOG_PRETTY_PRINT || false,
  },
  pg: {
    readHost: env.DB_READ_HOST,
    readPort: env.DB_READ_PORT,
    readDatabase: env.DB_READ_NAME,
    readUsername: env.DB_READ_USERNAME,
    readPassword: env.DB_READ_PASSWORD,
    writeHost: env.DB_WRITE_HOST,
    writePort: env.DB_WRITE_PORT,
    writeDatabase: env.DB_WRITE_NAME,
    writeUsername: env.DB_WRITE_USERNAME,
    writePassword: env.DB_WRITE_PASSWORD,
  },
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
  },
  apiKey: env.API_KEY,
}));
