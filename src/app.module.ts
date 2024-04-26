import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
