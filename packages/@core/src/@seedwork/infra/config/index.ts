import { config as envConfig } from 'dotenv';
import { join } from 'path';

// export const config = {
//   db: {
//     dialect: process.env.DB_DIALECT as any,
//     host: process.env.DB_HOST,
//     logging: process.env.DB_LOGGING === 'true',
//   },
// };
function makeConfig(envFile: string) {
  const output = envConfig({ path: envFile });
  return {
    db: {
      dialect: output.parsed.DB_DIALECT as any,
      host: output.parsed.DB_HOST,
      logging: output.parsed.DB_LOGGING === 'true',
    },
  };
}

const envTestFile = join(__dirname, '../../../../.test.env');
export const configTest = makeConfig(envTestFile);
