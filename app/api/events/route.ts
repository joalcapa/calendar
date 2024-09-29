import { NextResponse } from "next/server";

import getAllEvents from '@/services/events/getEvents';
import createEvent from "@/services/events/createEvent";

export async function GET(request: Request) {
  try {
    const events = await getAllEvents();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: Event = await request.json();
    const newEvent = await createEvent(data);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
  }
}