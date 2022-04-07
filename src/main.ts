import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from './common/pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Beland Builder API')
    .setDescription('The Builder API docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
