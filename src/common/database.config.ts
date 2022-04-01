import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export function getDatabaseConfig(
  config: ConfigService,
): SequelizeModuleOptions {
  return {
    dialect: 'postgres',
    host: config.get('DB_HOST'),
    port: config.get('DB_PORT') || 5432,
    username: config.get('DB_USER'),
    password: config.get('DB_PASS'),
    database: config.get('DB_NAME'),
    autoLoadModels: true,
    synchronize: true,
    models: [],
  };
}
