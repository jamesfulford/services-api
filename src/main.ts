import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './configureApp';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await configureApp(app);

  // Trigger database seeding
  await app.get(SeedService).seedDatabase();

  await app.listen(3000);
}
bootstrap();
