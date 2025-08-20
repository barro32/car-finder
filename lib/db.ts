import { sql } from '@vercel/postgres';

export interface Car {
  id: number;
  make: string;
  model: string;
  color: string;
  license_plate: string;
  latitude: number;
  longitude: number;
  reported_at: string;
  image_url?: string;
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create cars table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(100) NOT NULL,
        color VARCHAR(30) NOT NULL,
        license_plate VARCHAR(20) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image_url VARCHAR(500) NULL
      );
    `;

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_cars_location ON cars (latitude, longitude);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_cars_reported_at ON cars (reported_at DESC);
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Get all cars
export async function getCars(): Promise<Car[]> {
  try {
    const { rows } = await sql`
      SELECT 
        id,
        make,
        model,
        color,
        license_plate,
        latitude,
        longitude,
        reported_at,
        image_url
      FROM cars 
      ORDER BY reported_at DESC
    `;

    return rows.map((row: any) => ({
      ...row,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
    })) as Car[];
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}

// Add a new car
export async function addCar(carData: {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  location: { lat: number; lng: number };
  imageUrl?: string;
}): Promise<Car> {
  try {
    const { rows } = await sql`
      INSERT INTO cars (make, model, color, license_plate, latitude, longitude, image_url)
      VALUES (${carData.make}, ${carData.model}, ${carData.color}, ${carData.licensePlate}, ${carData.location.lat}, ${carData.location.lng}, ${carData.imageUrl || null})
      RETURNING 
        id,
        make,
        model,
        color,
        license_plate,
        latitude,
        longitude,
        reported_at,
        image_url
    `;

    const car = rows[0];
    return {
      ...car,
      latitude: parseFloat(car.latitude),
      longitude: parseFloat(car.longitude),
    } as Car;
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
}

// Delete a car (for admin purposes)
export async function deleteCar(id: number): Promise<boolean> {
  try {
    const { rowCount } = await sql`
      DELETE FROM cars WHERE id = ${id}
    `;

    return (rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
}

// Get cars within a specific area (for map filtering)
export async function getCarsInArea(
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }
): Promise<Car[]> {
  try {
    const { rows } = await sql`
      SELECT 
        id,
        make,
        model,
        color,
        license_plate,
        latitude,
        longitude,
        reported_at,
        image_url
      FROM cars 
      WHERE latitude BETWEEN ${bounds.south} AND ${bounds.north}
        AND longitude BETWEEN ${bounds.west} AND ${bounds.east}
      ORDER BY reported_at DESC
    `;

    return rows.map((row: any) => ({
      ...row,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
    })) as Car[];
  } catch (error) {
    console.error('Error fetching cars in area:', error);
    throw error;
  }
}
