import { NextResponse, NextRequest } from "next/server";

import GetWeather from '../../../services/weather/getWeather';

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get('location');
  const date = request.nextUrl.searchParams.get('date');

  if (!location || !date) {
    return NextResponse.json({ message: "Faltan parámetros" }, { status: 422 })
  }

  const service = new GetWeather({ location, date });
  await service.call();

  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 })
  }

  return NextResponse.json(service.getWeather(), { status: 200 });
}