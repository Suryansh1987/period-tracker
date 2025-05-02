import { 
  pgTable, 
  serial, 
  date, 
  integer, 
  text, 
  timestamp,
  varchar,
  primaryKey,
  pgEnum
} from 'drizzle-orm/pg-core';


export const conditionEnum = pgEnum('condition_type', [
  'none',
  'pcos', 
  'endometriosis', 
  'anemia', 
  'thyroid_disorder',
  'stress',
  'other'
]);


export const periodEntries = pgTable('period_entries', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  lastPeriodDate: timestamp('last_period_date').notNull(), 
  cycleLength: integer('cycle_length').notNull().default(28),
  periodDuration: integer('period_duration').notNull().default(5),
  conditions: conditionEnum('conditions').array().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});





