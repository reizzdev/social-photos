import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:'+process.env.PORT_FRONTEND, // puerto donde correrá Next
    credentials: true,
  });

  await app.listen(process.env.PORT_BACKEND ?? 4000);
}
bootstrap();