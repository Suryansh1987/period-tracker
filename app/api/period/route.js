import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { periodEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DUMMY_USER_ID } from '@/lib/constants';

// ✅ POST Method – Create a new period entry
export async function POST(request) {
  try {
    const body = await request.json();
    const userId = request.headers.get('X-User-Id') || DUMMY_USER_ID;

    const { lastPeriodDate, cycleLength, periodDuration, conditions, notes } = body;

    if (!lastPeriodDate) {
      return NextResponse.json({ error: 'Last period date is required' }, { status: 400 });
    }

    const parsedDate = new Date(lastPeriodDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for lastPeriodDate' }, { status: 400 });
    }

    const entry = await db.insert(periodEntries).values({
      userId,
      lastPeriodDate: parsedDate, // ✅ pass Date object, not ISO string
      cycleLength: typeof cycleLength === 'number' ? cycleLength : 28,
      periodDuration: typeof periodDuration === 'number' ? periodDuration : 5,
      conditions: Array.isArray(conditions) ? conditions : [],
      notes: typeof notes === 'string' ? notes : '',
    }).returning();

    return NextResponse.json({ entry: entry[0] });
  } catch (error) {
    console.error('❌ Error creating period entry:', error);
    return NextResponse.json({ error: 'Failed to create period entry' }, { status: 500 });
  }
}

// ✅ PUT Method – Update an existing period entry
export async function PUT(request) {
  try {
    const body = await request.json();
    const userId = request.headers.get('X-User-Id') || DUMMY_USER_ID;

    const {
      id,
      lastPeriodDate,
      cycleLength,
      periodDuration,
      conditions,
      notes
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }

    if (!lastPeriodDate) {
      return NextResponse.json({ error: 'Last period date is required' }, { status: 400 });
    }

    const parsedDate = new Date(lastPeriodDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for lastPeriodDate' }, { status: 400 });
    }

    const updateResult = await db
      .update(periodEntries)
      .set({
        lastPeriodDate: parsedDate, // NO .toISOString() — let Drizzle handle it
        cycleLength: typeof cycleLength === 'number' ? cycleLength : 28,
        periodDuration: typeof periodDuration === 'number' ? periodDuration : 5,
        conditions: Array.isArray(conditions) ? conditions : [],
        notes: typeof notes === 'string' ? notes : '',
        updatedAt: new Date()
      })
      .where(eq(periodEntries.id, id))
      .returning();

    return NextResponse.json({ updated: updateResult[0] });
  } catch (error) {
    console.error('❌ Error updating period entry:', error);
    return NextResponse.json({
      error: 'Failed to update period entry',
      detail: error.message
    }, { status: 500 });
  }
}


// ✅ GET Method – Fetch all entries for the user
export async function GET(request) {
  try {
    const userId = request.headers.get('X-User-Id') || DUMMY_USER_ID;

    const entries = await db
      .select()
      .from(periodEntries)
      .where(eq(periodEntries.userId, userId));

    if (!entries.length) {
      return NextResponse.json({ message: 'No period data found' }, { status: 404 });
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('❌ Error fetching period entries:', error);
    return NextResponse.json({ error: 'Failed to fetch period entries' }, { status: 500 });
  }
}
