import { Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Pool } from 'pg';
import { from, lastValueFrom, timer } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import configuration from 'src/config/configuration';
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

export function generateDBPool({
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
        host: config.db.write.host,
        database: config.db.write.database,
        port: parseInt(config.db.write.port, 10),
        user: config.db.write.username,
        password: config.db.write.password,
      };
      const readPool = {
        host: config.db.read.host,
        database: config.db.read.database,
        port: parseInt(config.db.read.port, 10),
        user: config.db.read.username,
        password: config.db.read.password,
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
            const message = `${K.DATABASE_CONNECTION} [${connectionName}] ${err}`;
            logger.error(message);
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
