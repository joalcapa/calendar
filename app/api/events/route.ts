import { NextResponse } from "next/server";
import GetEvents from '../../../services/events/getEvents';
import CreateEvent from "../../../services/events/createEvent";

/**
 * Handles GET requests to retrieve all events.
 *
 * @returns A NextResponse object containing a list of events or an error message.
 */
export async function GET() {
  const service = new GetEvents({});
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 });
  }

  return NextResponse.json(service.getEvents(), { status: 200 });
}

/**
 * Handles POST requests to create a new event.
 *
 * @param request - The incoming Request object containing the event data to be created.
 * @returns A NextResponse object containing the created event data or an error message.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const service = new CreateEvent(body);
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 });
  }

  return NextResponse.json(service.getEvent(), { status: 200 });
}
