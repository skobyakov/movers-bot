import fs from 'fs';
import path from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

async function bootstrap() {
  let httpsOptions = undefined;
  if (process.env.NODE_ENV === 'production') {
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, '..', 'private-key.key'), {
        encoding: 'utf-8',
      }),
      cert: fs.readFileSync(
        path.join(__dirname, '..', 'public-certificate.crt'),
        { encoding: 'utf-8' },
      ),
    };
  }
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
