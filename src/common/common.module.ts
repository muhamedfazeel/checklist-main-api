import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'src/custom-logger/custom-logger.module';
import { DatabaseModule } from 'src/database/database.module';
import { HttpRestModule } from 'src/http-rest/http-rest.module';
import { UtilsModule } from 'src/utils/utils.module';

const sharedModules = [
  CustomLoggerModule,
  HttpRestModule,
  UtilsModule,
  DatabaseModule,
];

@Module({
  imports: sharedModules,
  exports: sharedModules,
})
export class CommonModule {}
