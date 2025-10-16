import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow your frontend(s) to call the API
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://YOUR-FRONTEND.vercel.app' // <-- replace after you deploy the frontend
    ],
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ API listening on http://0.0.0.0:${port}`);
}

bootstrap();