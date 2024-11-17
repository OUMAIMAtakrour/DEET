import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Router } from 'express';
import { Server } from 'http';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors({
    origin: '*', // Allow all origins (use specific URLs in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
    credentials: true, // Allow cookies to be sent if needed
  });

  await app.listen(3000);

  //  const server = app.getHttpServer();
  //   const router = server._events.request._router;

  //   const availableRoutes: [] = router.stack
  //     .map(layer => {
  //       if (layer.route) {
  //         return {
  //           route: {
  //             path: layer.route?.path,
  //             method: layer.route?.stack[0].method,
  //           },
  //         };
  //       }
  //     })
  //     .filter(item => item !== undefined);
  //   console.log(availableRoutes);
}
bootstrap();
