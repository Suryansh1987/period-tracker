import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const dbUrl = new URL(process.env.DATABASE_URL);

export default {
  schema: './lib/db/schema.ts',  // path to your schema file
  out: './migrations',           // output directory for migrations
  dialect: 'postgresql',         // using 'postgresql' as the dialect
  dbCredentials: {
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 5432, // Default to 5432 for PostgreSQL
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.split('/')[1], // Extract database name from URL path
    ssl: {
      rejectUnauthorized: false, // Disable certificate validation if necessary
    },
  },
} ;
