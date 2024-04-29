import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...userProviders, UserService, NotificationService],
  exports: [UserService],
})
export class UserModule {}
