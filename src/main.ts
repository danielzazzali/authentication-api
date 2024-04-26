import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './config/config';
import { LoggingMiddleware } from './middleware/logging.middleware';

const port = process.env.APP_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const loggingMiddleware = new LoggingMiddleware();

  app.use(loggingMiddleware.use.bind(loggingMiddleware));

  await app.listen(port);
}

bootstrap()
  .then(() => {
    console.log(`App listening on http://localhost:${port}\n`);
  })
  .catch((err) => {
    console.error(err);
    setTimeout(() => {
      process.exit(1);
    }, 0);
  });
