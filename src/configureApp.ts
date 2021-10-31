import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

export async function configureApp(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  return app;
}
