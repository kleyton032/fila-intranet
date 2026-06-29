import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
  poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
  poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  poolIncrement: parseInt(process.env.DB_POOL_INCREMENT || '1', 10),
}));
