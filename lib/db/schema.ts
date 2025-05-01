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

// Create a custom enum for period conditions
export const conditionEnum = pgEnum('condition_type', [
  'none',
  'pcos', 
  'endometriosis', 
  'anemia', 
  'thyroid_disorder',
  'stress',
  'other'
]);

// Period tracker table
// Period tracker table
export const periodEntries = pgTable('period_entries', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  lastPeriodDate: timestamp('last_period_date').notNull(), // Use timestamp instead of date
  cycleLength: integer('cycle_length').notNull().default(28),
  periodDuration: integer('period_duration').notNull().default(5),
  conditions: conditionEnum('conditions').array().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});


// Table for tracking individual period days
export const periodDays = pgTable('period_days', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  date: date('date').notNull(),
  flow: integer('flow').default(2), // 1-5 scale where 1 is light, 5 is heavy
  symptoms: text('symptoms').array(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Create a compound unique constraint
export const uniquePeriodDay = pgTable(
  'unique_period_day',
  {
    userId: varchar('user_id', { length: 255 }).notNull(),
    date: date('date').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.date] }),
  })
);
