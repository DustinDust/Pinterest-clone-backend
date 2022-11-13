import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.enableCors({
    origin: "*"
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: false, validateCustomDecorators: true }),
  );
  await app.listen(3000);
}
bootstrap();
