import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { NotificationService } from './notification/notification.service';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [AuthModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [NotificationService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
