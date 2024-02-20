import { Module } from '@nestjs/common';
import { CustomLoggerModule } from './logger/custom-logger.module';
import { DatabaseModule } from 'src/database/database.module';
import { UtilsModule } from 'src/utils/utils.module';

const commonModules = [DatabaseModule, CustomLoggerModule, UtilsModule];

@Module({
  imports: commonModules,
  exports: commonModules,
})
export class CommonModule {}
