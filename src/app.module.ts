import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { NotificationService } from './notification/notification.service';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { TokenService } from './token/token.service';

@Module({
  imports: [AuthModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [NotificationService, TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
