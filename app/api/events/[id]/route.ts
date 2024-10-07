import { NextResponse, NextRequest } from "next/server";
import GetEvent from '../../../../services/events/getEvents';
import DeleteEvent from '../../../../services/events/deleteEvent';
import UpdateEvent from '../../../../services/events/updateEvent';

/**
 * Handles GET requests to retrieve an event by its ID.
 *
 * @param request - The incoming NextRequest object.
 * @param params - An object containing route parameters.
 * @param params.params.id - The ID of the event to retrieve.
 * @returns A NextResponse object containing the event data or an error message.
 */
export async function GET(request: NextRequest, params: { params: { id: string } }) {
  const service = new GetEvent(parseInt(params.params.id));
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 });
  }

  return NextResponse.json(service.getEvents(), { status: 200 });
}

/**
 * Handles PUT requests to update an existing event by its ID.
 *
 * @param request - The incoming NextRequest object containing the updated event data.
 * @param params - An object containing route parameters.
 * @param params.params.id - The ID of the event to update.
 * @returns A NextResponse object containing the updated event data or an error message.
 */
export async function PUT(request: NextRequest, params: { params: { id: string } }) {
  const body = await request.json();
  const service = new UpdateEvent(parseInt(params.params.id), body);
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 });
  }

  return NextResponse.json(service.getEvent(), { status: 200 });
}

/**
 * Handles DELETE requests to remove an event by its ID.
 *
 * @param request - The incoming NextRequest object.
 * @param params - An object containing route parameters.
 * @param params.params.id - The ID of the event to delete.
 * @returns A NextResponse object containing a success message or an error message.
 */
export async function DELETE(request: NextRequest, params: { params: { id: string } }) {
  const service = new DeleteEvent(parseInt(params.params.id));
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 });
  }

  return NextResponse.json({ message: 'Borrado exitosamente' }, { status: 200 });
}
