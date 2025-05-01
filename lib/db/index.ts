import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check for the environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a PostgreSQL connection
const client = postgres(process.env.DATABASE_URL, { max: 1 });

// Create a Drizzle ORM instance with our schema
export const db = drizzle(client, { schema });