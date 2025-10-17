import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // enable proxy trust for Secure cookies on Render
  app.set('trust proxy', 1);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://YOUR-FRONTEND.vercel.app', // <-- change to your real Vercel URL
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  // quick health route
  const http = app.getHttpAdapter().getInstance();
  http.get('/health', (_req, res) => res.json({ ok: true }));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`✅ API listening on ${port}`);
}

bootstrap();