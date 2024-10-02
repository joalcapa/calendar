import { NextResponse, NextRequest } from "next/server";

import GetEvents from '@/services/events/getEvents';
import CreateEvent from "@/services/events/createEvent";

export async function GET(request: NextRequest) {
  const service = new GetEvents();
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 })
  }

  return NextResponse.json(service.getEvents(), { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const service = new CreateEvent(body);
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 })
  }

  return NextResponse.json(service.getEvent(), { status: 200 });
}