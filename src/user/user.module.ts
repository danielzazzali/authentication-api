import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { NotificationService } from '../notification/notification.service';
import { TokenService } from '../token/token.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...userProviders, UserService, NotificationService, TokenService],
  exports: [UserService],
})
export class UserModule {}
