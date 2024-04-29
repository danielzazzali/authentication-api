import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { ForgotPassword } from './entities/forgot-password.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'FORGOT_PASSWORD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ForgotPassword),
    inject: ['DATA_SOURCE'],
  },
];
