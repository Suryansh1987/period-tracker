import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const dbUrl = new URL(process.env.DATABASE_URL);

export default {
  schema: './lib/db/schema.ts',  
  out: './migrations',           
  dialect: 'postgresql',         
  dbCredentials: {
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 5432, 
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.split('/')[1], 
    ssl: {
      rejectUnauthorized: false, 
    },
  },
} ;
