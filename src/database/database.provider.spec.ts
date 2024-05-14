import { Test, TestingModule } from '@nestjs/testing';
import { Provider, FactoryProvider } from '@nestjs/common';
import { databaseProviders } from './database.provider';

jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue('mocked data source'),
  })),
}));

describe('DatabaseProvider', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [...databaseProviders],
    }).compile();
  });

  it('should be defined', () => {
    expect(databaseProviders).toBeDefined();
  });

  it('should initialize data source', async () => {
    const dataSourceProvider = databaseProviders.find(
      (provider: Provider) =>
        (provider as FactoryProvider).provide === 'DATA_SOURCE',
    ) as FactoryProvider;
    const dataSource = await dataSourceProvider.useFactory();
    expect(dataSource).toEqual('mocked data source');
  });
});
