import { NextResponse, NextRequest } from "next/server";

import GetEvent from '@/services/events/getEvent';
import DeleteEvent from '@/services/events/deleteEvent';
import UpdateEvent from '@/services/events/updateEvent';

export async function GET(request: NextRequest, params: { params: { id: string } }) {
  const service = new GetEvent(parseInt(params.params.id));
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 })
  }

  return NextResponse.json(service.getEvent(), { status: 200 });
}

export async function PUT(request: NextRequest, params: { params: { id: string } }) {
  const service = new UpdateEvent(parseInt(params.params.id), await request.json());
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 })
  }

  return NextResponse.json(service.getEvent(), { status: 200 });
}

export async function DELETE(request: NextRequest, params: { params: { id: string } }) {
  const service = new DeleteEvent(parseInt(params.params.id));
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 })
  }

  return NextResponse.json({ message: 'Borrado exitosamente' }, { status: 200 });
}