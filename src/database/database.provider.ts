import { Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Pool } from 'pg';
import { from, lastValueFrom, timer } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import configuration from 'src/config/configuration';
import { CustomLogger } from 'src/custom-logger/custom-logger.service';
import * as K from './constants/database.constants';

export const pgReadConnectionFactory: Provider = generateDBPool({
  isWriteReplica: false,
  provider: K.POSTGRES_READ_CONNECTION.PROVIDER,
  connectionName: K.POSTGRES_READ_CONNECTION.NAME,
  factoryName: K.POSTGRES_READ_CONNECTION.FACTORY,
});

export const pgWriteConnectionFactory: Provider = generateDBPool({
  isWriteReplica: true,
  provider: K.POSTGRES_WRITE_CONNECTION.PROVIDER,
  connectionName: K.POSTGRES_WRITE_CONNECTION.NAME,
  factoryName: K.POSTGRES_WRITE_CONNECTION.FACTORY,
});

function generateDBPool({
  connectionName,
  isWriteReplica,
  provider,
  factoryName,
}): Provider {
  return {
    provide: provider,
    useFactory: async (config: ConfigType<typeof configuration>) => {
      const logger = new CustomLogger(factoryName);
      logger.setContext(factoryName);

      const writePool = {
        host: config.pg.writeHost,
        database: config.pg.writeDatabase,
        port: parseInt(config.pg.writePort, 10),
        user: config.pg.writeUsername,
        password: config.pg.writePassword,
      };
      const readPool = {
        host: config.pg.readHost,
        database: config.pg.readDatabase,
        port: parseInt(config.pg.readPort, 10),
        user: config.pg.readUsername,
        password: config.pg.readPassword,
      };
      const pool = new Pool(isWriteReplica ? writePool : readPool);

      return lastValueFrom(
        from(pool.connect()).pipe(
          retry({
            count: K.MAX_ATTEMPT,
            delay: (error: Error, retryCount) => {
              logger.warn(
                `Unable to connect to ${connectionName}. ${error.message}. Retrying ${retryCount}...`,
              );
              return timer(K.ATTEMPT_DELAY);
            },
            resetOnSuccess: true,
          }),
          catchError(async (err) => {
            throw err;
          }),
          tap(() => {
            logger.log(`Connected to Postgres ${connectionName} successfully!`);
          }),
        ),
      );
    },
    inject: [configuration.KEY],
  };
}
