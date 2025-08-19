import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'cars.json');

// Default data for when the file doesn't exist
const defaultCars = [
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

// Helper function to read cars from file
async function readCars() {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    // Try to read the file
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is corrupted, return default data
    console.log('Creating new cars.json file with default data');
    await saveCars(defaultCars);
    return defaultCars;
  }
}

// Helper function to save cars to file
async function saveCars(cars: any[]) {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    // Write the data to file
    await fs.writeFile(DATA_FILE, JSON.stringify(cars, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving cars data:', error);
    throw error;
  }
}


export async function GET() {
  try {
    const cars = await readCars();
    return NextResponse.json({ cars });
  } catch (error) {
    console.error('Error reading cars:', error);
    return NextResponse.json({ error: 'Failed to read cars data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const cars = await readCars();

    // Generate new ID based on existing cars
    const maxId = cars.length > 0 ? Math.max(...cars.map((car: any) => car.id)) : 0;

    const newCar = {
      id: maxId + 1,
      ...data,
      reportedAt: new Date().toISOString(),
    };

    cars.push(newCar);
    await saveCars(cars);

    console.log('New car saved:', newCar);
    return NextResponse.json({ car: newCar }, { status: 201 });
  } catch (error) {
    console.error('Error saving car:', error);
    return NextResponse.json({ error: 'Failed to save car data' }, { status: 500 });
  }
}
