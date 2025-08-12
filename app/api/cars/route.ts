import { NextResponse } from 'next/server';

const stolenCars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Corolla',
    color: 'Red',
    licensePlate: 'ABC123',
    location: { lat: 51.5074, lng: -0.1278 },
    reportedAt: '2025-08-10T14:30:00Z',
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    color: 'Blue',
    licensePlate: 'XYZ789',
    location: { lat: 51.509, lng: -0.08 },
    reportedAt: '2025-08-11T09:15:00Z',
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Focus',
    color: 'Black',
    licensePlate: 'LMN456',
    location: { lat: 51.5033, lng: -0.1195 },
    reportedAt: '2025-08-12T08:00:00Z',
  },
];


export async function GET() {
  return NextResponse.json({ cars: stolenCars });
}

export async function POST(req: Request) {
  const data = await req.json();
  const newCar = {
    id: stolenCars.length + 1,
    ...data,
    reportedAt: new Date().toISOString(),
  };
  stolenCars.push(newCar);
  return NextResponse.json({ car: newCar }, { status: 201 });
}
