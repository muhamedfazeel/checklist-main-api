import { RequestMethod, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { name, description, version } from '../package.json';
import { AppModule } from './app.module';
import { SuccessResponseInterceptor } from './interceptors/success.response.interceptor';
import { CustomLogger } from './custom-logger/custom-logger.service';
import * as K from './common/constants';

async function bootstrap() {
  const logger = new CustomLogger('Main');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: K.MAX_JSON_REQUEST_SIZE }),
  );

  app.setGlobalPrefix(K.API_PREFIX, {
    exclude: [{ path: 'status', method: RequestMethod.GET }],
  });
  app.useLogger(logger);
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.enableVersioning({ type: VersioningType.URI });

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('config.server.port');
  const env = config.get('config.server.env');
  const swaggerServer = config.get('config.swagger.server');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  if (swaggerServer === 'true' && env !== 'production') {
    const options = new DocumentBuilder()
      .setTitle(name)
      .setDescription(`${description}\nRunning on ${env} Mode`)
      .setVersion(version)
      .addServer(`http://localhost:${port}`, 'Local Dev Server')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);
  }

  await app.listen(port, '0.0.0.0');
  logger.log(`Listening on port ${port}, running in ${env} environment`);
}
bootstrap();
