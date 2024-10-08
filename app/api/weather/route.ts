import { NextResponse, NextRequest } from "next/server";
import GetWeather from '../../../services/weather/getWeather';

/**
 * Handles GET requests to retrieve weather information based on location and date.
 *
 * @param request - The incoming NextRequest object containing query parameters.
 * @returns A NextResponse object containing weather data or an error message.
 */
export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get('location');
  const date = request.nextUrl.searchParams.get('date');

  // Check for missing parameters
  if (!location || !date) {
    return NextResponse.json({ message: "Faltan parámetros" }, { status: 422 });
  }

  const service = new GetWeather({ location, date });
  await service.call();

  // Check for errors in the service call
  if (!service.valid) {
    return NextResponse.json(service.getError(), { status: 422 });
  }

  return NextResponse.json(service.getWeather(), { status: 200 });
}

export const dynamic = 'force-dynamic'