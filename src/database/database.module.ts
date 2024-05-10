import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'src/custom-logger/custom-logger.module';
import { UtilsModule } from '../utils/utils.module';
import {
  pgReadConnectionFactory,
  pgWriteConnectionFactory,
} from './database.provider';
import { DatabaseService } from './database.service';

@Module({
  imports: [CustomLoggerModule, UtilsModule],
  providers: [
    pgReadConnectionFactory,
    pgWriteConnectionFactory,
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
