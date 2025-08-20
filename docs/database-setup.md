# Database Setup Instructions

## Setting up Vercel Postgres

### 1. Create Vercel Account and Project
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Connect your GitHub repository
3. Deploy your CarFinder project

### 2. Add Vercel Postgres Database
1. In your Vercel dashboard, go to your project
2. Go to the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a database name (e.g., "carfinder-db")
6. Select your preferred region
7. Click "Create"

### 3. Configure Environment Variables
Vercel will automatically set up these environment variables for your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` 
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 4. Local Development Setup
For local development, you can either:

**Option A: Use Vercel CLI (Recommended)**
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
```

**Option B: Manual Setup**
1. Copy `.env.example` to `.env.local`
2. Get your database connection string from Vercel dashboard
3. Add it to `.env.local`

### 5. Run Migration
After setting up the database, run the migration to transfer existing data:

```bash
# Initialize the database (creates tables)
npm run db:init

# Migrate existing JSON data to database (if you have existing data)
npm run migrate
```

### 6. Test Your Setup
```bash
npm run dev
```

Visit your app and try adding a new car report to test the database integration.

## Database Schema

The database uses this schema:

```sql
CREATE TABLE cars (
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

CREATE INDEX idx_cars_location ON cars (latitude, longitude);
CREATE INDEX idx_cars_reported_at ON cars (reported_at DESC);
```

## Features Added

✅ **Database Integration**: Replaced JSON file storage with Postgres
✅ **Migration Script**: Automatically migrates existing data
✅ **Image Support**: Added optional image URL field for car photos
✅ **Performance**: Added database indexes for location and date queries
✅ **Scalability**: Database can handle thousands of car reports
✅ **Production Ready**: Optimized for Vercel deployment

## Available Commands

- `npm run migrate` - Migrate JSON data to database
- `npm run db:init` - Initialize database tables
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Troubleshooting

**Connection Issues:**
- Ensure environment variables are set correctly
- Check Vercel dashboard for database status
- Verify your IP is allowed (Vercel Postgres allows all by default)

**Migration Issues:**
- Backup your `data/cars.json` file before running migration
- The migration script creates a backup automatically
- You can re-run migration safely (it won't duplicate data)

**Local Development:**
- Use `vercel env pull` to get the latest environment variables
- Make sure you're logged into Vercel CLI
