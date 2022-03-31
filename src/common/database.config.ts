import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export function getDatabaseConfig(
  config: ConfigService,
): SequelizeModuleOptions {
  return {
    dialect: 'postgres',
    host: config.get('DB_HOST'),
    port: 5432,
    username: 'postgres',
    password: 'example',
    database: 'beland-nft-api',
    autoLoadModels: true,
    synchronize: true,
    models: [],
  };
}
