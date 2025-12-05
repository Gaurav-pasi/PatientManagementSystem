/**
 * Environment variable validation and configuration
 * Validates all required environment variables at startup
 */

import { AUTH_CONFIG } from './constants';

interface EnvironmentConfig {
  // Server
  port: number;
  nodeEnv: string;

  // Database
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;

  // JWT
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;

  // Security
  bcryptSaltRounds: number;
  corsOrigin: string;

  // Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;

  // File Upload
  maxFileSize: number;
  uploadPath: string;
}

/**
 * Validates that a required environment variable exists
 * @param key - Environment variable name
 * @param defaultValue - Optional default value
 * @returns The environment variable value
 * @throws Error if required variable is missing and no default provided
 */
function getRequiredEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please check your .env file or environment configuration.`
    );
  }

  return value;
}

/**
 * Gets an optional environment variable with a default value
 * @param key - Environment variable name
 * @param defaultValue - Default value if not set
 * @returns The environment variable value or default
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Parses an environment variable as an integer
 * @param key - Environment variable name
 * @param defaultValue - Default value if not set
 * @returns The parsed integer value
 */
function getIntEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`Warning: ${key} is not a valid integer, using default: ${defaultValue}`);
    return defaultValue;
  }

  return parsed;
}

/**
 * Validates and loads all environment configuration
 * Should be called at application startup
 */
export function loadEnvironment(): EnvironmentConfig {
  // In development, allow fallback values for easier setup
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Validate critical security settings in production
  if (!isDevelopment) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be set in production environment');
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET must be set in production environment');
    }
    if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
      throw new Error('JWT_SECRET must be changed from default value in production');
    }
  }

  const config: EnvironmentConfig = {
    // Server
    port: getIntEnv('PORT', 3000),
    nodeEnv: getOptionalEnv('NODE_ENV', 'development'),

    // Database
    dbHost: getOptionalEnv('DB_HOST', 'localhost'),
    dbPort: getIntEnv('DB_PORT', 5432),
    dbName: getRequiredEnv('DB_NAME', isDevelopment ? 'patient_management' : undefined),
    dbUser: getRequiredEnv('DB_USER', isDevelopment ? 'postgres' : undefined),
    dbPassword: getRequiredEnv('DB_PASSWORD', isDevelopment ? 'postgres' : undefined),

    // JWT - Use secure defaults in development, require in production
    jwtSecret: getRequiredEnv(
      'JWT_SECRET',
      isDevelopment ? 'dev-jwt-secret-change-in-production' : undefined
    ),
    jwtRefreshSecret: getRequiredEnv(
      'JWT_REFRESH_SECRET',
      isDevelopment ? 'dev-refresh-secret-change-in-production' : undefined
    ),
    jwtExpiresIn: getOptionalEnv('JWT_EXPIRES_IN', AUTH_CONFIG.JWT_ACCESS_TOKEN_EXPIRY),
    jwtRefreshExpiresIn: getOptionalEnv('JWT_REFRESH_EXPIRES_IN', AUTH_CONFIG.JWT_REFRESH_TOKEN_EXPIRY),

    // Security
    bcryptSaltRounds: getIntEnv('BCRYPT_SALT_ROUNDS', AUTH_CONFIG.BCRYPT_SALT_ROUNDS),
    corsOrigin: getOptionalEnv('CORS_ORIGIN', 'http://localhost:5173'),

    // Rate Limiting
    rateLimitWindowMs: getIntEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    rateLimitMaxRequests: getIntEnv('RATE_LIMIT_MAX_REQUESTS', 100),

    // File Upload
    maxFileSize: getIntEnv('MAX_FILE_SIZE', 5 * 1024 * 1024),
    uploadPath: getOptionalEnv('UPLOAD_PATH', './uploads'),
  };

  return config;
}

/**
 * Singleton environment configuration
 * Loaded once at application startup
 */
let envConfig: EnvironmentConfig | null = null;

/**
 * Gets the environment configuration
 * Loads configuration on first call
 */
export function getEnvConfig(): EnvironmentConfig {
  if (!envConfig) {
    envConfig = loadEnvironment();
  }
  return envConfig;
}

/**
 * Validates environment at startup
 * Call this in your main application file
 */
export function validateEnvironment(): void {
  try {
    const config = loadEnvironment();
    console.log(`Environment validated successfully (${config.nodeEnv} mode)`);
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}
