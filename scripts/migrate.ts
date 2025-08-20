import { promises as fs } from 'fs';
import path from 'path';
import { initializeDatabase, addCar } from '../lib/db';

const DATA_FILE = path.join(process.cwd(), 'data', 'cars.json');

interface OldCar {
  id: number;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  location: { lat: number; lng: number };
  reportedAt: string;
}

async function migrateFromJsonToDatabase() {
  try {
    console.log('🔄 Starting migration from JSON to Postgres...');

    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Check if JSON file exists
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const cars: OldCar[] = JSON.parse(data);

      console.log(`📄 Found ${cars.length} cars in JSON file`);

      // Migrate each car to database
      let migratedCount = 0;
      for (const car of cars) {
        try {
          await addCar({
            make: car.make,
            model: car.model,
            color: car.color,
            licensePlate: car.licensePlate,
            location: car.location,
            imageUrl: undefined, // No images in old format
          });
          migratedCount++;
          console.log(`✅ Migrated car ${migratedCount}/${cars.length}: ${car.make} ${car.model}`);
        } catch (error) {
          console.error(`❌ Failed to migrate car: ${car.make} ${car.model}`, error);
        }
      }

      console.log(`🎉 Migration completed! ${migratedCount}/${cars.length} cars migrated`);

      // Optionally backup the JSON file
      const backupFile = DATA_FILE + '.backup';
      await fs.copyFile(DATA_FILE, backupFile);
      console.log(`💾 JSON file backed up to: ${backupFile}`);

    } catch (jsonError) {
      console.log('📄 No existing JSON file found or file is empty. Starting with fresh database.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateFromJsonToDatabase()
    .then(() => {
      console.log('🏁 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateFromJsonToDatabase };
