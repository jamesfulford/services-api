import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Trigger database seeding
  await app.get(SeedService).seedDatabase();

  await app.listen(3000);

  const servicesResponse = (
    await axios.get(
      'http://localhost:3000/organization/1/services?pageSize=2&page=2',
    )
  ).data;
  console.log(servicesResponse);
}
bootstrap();
