import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1) Trust proxy for secure cookies on Render
  app.set('trust proxy', 1);

  // 2) Enable CORS BEFORE defining any routes
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://lms-proto-frontend.vercel.app', // <-- your exact Vercel URL
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  // 3) Now define the health route (after CORS)
  const http = app.getHttpAdapter().getInstance();
  http.get('/health', (_req, res) => res.json({ ok: true }));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`✅ API listening on ${port}`);
}

bootstrap();