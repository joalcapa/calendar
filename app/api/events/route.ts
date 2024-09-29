import { NextResponse } from "next/server";

import getAllEvents from '@/services/events/getEvents';

export async function GET(request: Request) {
  try {
    const events = await getAllEvents();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}