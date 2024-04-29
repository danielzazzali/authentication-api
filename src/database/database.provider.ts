import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';

/**
 * This file contains the provider for the database connection.
 * @file
 */

/**
 * The array of providers for the database module.
 * @type {Array}
 */
export const databaseProviders: Provider[] = [
  {
    /**
     * The name of the provider.
     * @type {string}
     */
    provide: 'DATA_SOURCE',
    /**
     * The factory function that initializes the data source.
     * @async
     * @returns {Promise} The initialized data source.
     */
    useFactory: async (): Promise<DataSource> => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        useUTC: true,
      });

      return dataSource.initialize();
    },
  },
];
