import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  NODE_ENV: string;
  DATABASE_URL: string;
  MONGO_URI: string;
  PORT: number;
  API_PREFIX: string;
  VERSION: string;
}

const envSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
    MONGO_URI: joi.string().required(),
    API_PREFIX: joi.string().default('api'),
    VERSION: joi.string().default('v1'),
  })
  .unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs: Readonly<EnvVars> = envVars;

export const isProduction = envs.NODE_ENV === 'production';

export const isDevelopment = envs.NODE_ENV === 'development';

export const isTest = envs.NODE_ENV === 'test';
