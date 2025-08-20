import { NextResponse } from 'next/server';
import { getCars, addCar, initializeDatabase } from '../../../lib/db';

// Initialize database on first request
let dbInitialized = false;

async function ensureDatabase() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureDatabase();
    const cars = await getCars();

    // Transform database format to match frontend expectations
    const transformedCars = cars.map(car => ({
      id: car.id,
      make: car.make,
      model: car.model,
      color: car.color,
      licensePlate: car.license_plate,
      location: { lat: car.latitude, lng: car.longitude },
      reportedAt: car.reported_at,
      imageUrl: car.image_url,
    }));

    return NextResponse.json({ cars: transformedCars });
  } catch (error) {
    console.error('Error reading cars:', error);
    return NextResponse.json({ error: 'Failed to read cars data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabase();
    const data = await req.json();

    const newCar = await addCar({
      make: data.make,
      model: data.model,
      color: data.color,
      licensePlate: data.licensePlate,
      location: data.location,
      imageUrl: data.imageUrl,
    });

    // Transform database format to match frontend expectations
    const transformedCar = {
      id: newCar.id,
      make: newCar.make,
      model: newCar.model,
      color: newCar.color,
      licensePlate: newCar.license_plate,
      location: { lat: newCar.latitude, lng: newCar.longitude },
      reportedAt: newCar.reported_at,
      imageUrl: newCar.image_url,
    };

    console.log('New car saved:', transformedCar);
    return NextResponse.json({ car: transformedCar }, { status: 201 });
  } catch (error) {
    console.error('Error saving car:', error);
    return NextResponse.json({ error: 'Failed to save car data' }, { status: 500 });
  }
}
