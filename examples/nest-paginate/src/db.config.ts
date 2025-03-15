import { registerAs } from '@nestjs/config';
import { SystemCommon } from './common/common.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dbConfig = registerAs('db', () => ({
  options: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME,
    entities: [SystemCommon],
    synchronize: true,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
  },
}));
