import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:3000', credentials: true },
  });
  await app.listen(3001);
  console.log('✅ API listening on http://localhost:3001');
}
bootstrap();
app.enableCors({
  origin: ['http://localhost:3000','https://YOUR-FRONTEND.vercel.app'], // update later
  credentials: true
});

await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, '0.0.0.0');