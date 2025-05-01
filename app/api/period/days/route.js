import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { periodDays } from '@/lib/db/schema';
import { eq, and, between } from 'drizzle-orm';
import { DUMMY_USER_ID } from '@/lib/constants';

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

export async function GET(request) {
  try {
    const userId = request.headers.get('X-User-Id') || DUMMY_USER_ID;
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    let whereClause = eq(periodDays.userId, userId);

    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        return NextResponse.json(
          { error: 'Invalid start or end date format' },
          { status: 400 }
        );
      }

      whereClause = and(
        eq(periodDays.userId, userId),
        between(periodDays.date, parsedStartDate.toISOString(), parsedEndDate.toISOString())
      );
    }

    const days = await db.select().from(periodDays).where(whereClause);

    return NextResponse.json({ days });
  } catch (error) {
    console.error('Error fetching period days:', error);
    return NextResponse.json(
      { error: 'Failed to fetch period days' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userId = request.headers.get('X-User-Id') || DUMMY_USER_ID;
    const { date, flow, symptoms, notes } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const existingDay = await db
      .select()
      .from(periodDays)
      .where(
        and(
          eq(periodDays.userId, userId),
          eq(periodDays.date, parsedDate.toISOString()) // Ensure correct ISO string format
        )
      );

    if (existingDay.length > 0) {
      // Update existing day
      const updatedDay = await db
        .update(periodDays)
        .set({
          flow,
          symptoms,
          notes,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(periodDays.userId, userId),
            eq(periodDays.date, parsedDate.toISOString()) // Ensure correct ISO string format
          )
        )
        .returning();

      return NextResponse.json({ day: updatedDay[0] });
    }

    // Insert new day
    const insertedDay = await db.insert(periodDays).values({
      userId,
      date: parsedDate.toISOString(),
      flow: flow || 2,
      symptoms: symptoms || [],
      notes: notes || '',
    }).returning();

    return NextResponse.json({ day: insertedDay[0] });
  } catch (error) {
    console.error('Error creating/updating period day:', error);
    return NextResponse.json(
      { error: 'Failed to create/update period day' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const userId = request.headers.get('X-User-Id') || DUMMY_USER_ID;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    await db
      .delete(periodDays)
      .where(
        and(
          eq(periodDays.userId, userId),
          eq(periodDays.date, parsedDate.toISOString()) // Ensure correct ISO string format
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting period day:', error);
    return NextResponse.json(
      { error: 'Failed to delete period day' },
      { status: 500 }
    );
  }
}
