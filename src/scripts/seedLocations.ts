import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Location from '../models/Location';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cmms';

const initialLocations = [
  {
    name: "Building A - 1st Floor",
    code: "BA-F1",
    type: "Floor",
    description: "Main floor with reception and offices",
    parentLocation: "Building A",
    assetCount: 15,
    address: "123 Main Street, Building A",
    department: "Quality Assurance",
    status: "active"
  },
  {
    name: "Building A - Conference Room A",
    code: "BA-CRA",
    type: "Room",
    description: "Main conference room on 1st floor",
    parentLocation: "Building A - 1st Floor",
    assetCount: 3,
    address: "123 Main Street, Building A",
    department: "Quality Assurance",
    status: "active"
  },
  {
    name: "Building B - Warehouse 1",
    code: "BB-WH1",
    type: "Warehouse",
    description: "Primary storage warehouse for parts",
    parentLocation: "Building B",
    assetCount: 78,
    address: "456 Oak Avenue, Building B",
    department: "Maintenance Engineering",
    status: "active"
  },
  {
    name: "Main Campus - Server Room",
    code: "MC-SRV",
    type: "Utility Room",
    description: "Central server and networking equipment",
    parentLocation: "Main Campus",
    assetCount: 25,
    address: "789 Pine Street, Admin Building",
    department: "IT Department",
    status: "active"
  },
  {
    name: "Building C - Lab 2B",
    code: "BC-L2B",
    type: "Laboratory",
    description: "Research and Development Lab",
    parentLocation: "Building C - 2nd Floor",
    assetCount: 12,
    address: "101 Innovation Drive, Building C",
    department: "Research & Development",
    status: "active"
  },
  {
    name: "Building A - 2nd Floor",
    code: "BA-F2",
    type: "Floor",
    description: "Second floor with department offices",
    parentLocation: "Building A",
    assetCount: 22,
    address: "123 Main Street, Building A",
    department: "Quality Assurance",
    status: "active"
  },
  {
    name: "Building B - Warehouse 2",
    code: "BB-WH2",
    type: "Warehouse",
    description: "Secondary storage for large equipment",
    parentLocation: "Building B",
    assetCount: 45,
    address: "456 Oak Avenue, Building B",
    department: "Maintenance Engineering",
    status: "active"
  },
  {
    name: "Main Campus - Electrical Room",
    code: "MC-ER",
    type: "Utility Room",
    description: "Main electrical distribution panels",
    parentLocation: "Main Campus",
    assetCount: 18,
    address: "789 Pine Street, Admin Building",
    department: "Facilities Management",
    status: "active"
  }
];

async function seedLocations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing locations
    await Location.deleteMany({});
    console.log('Cleared existing locations');

    // Insert new locations
    const createdLocations = await Location.insertMany(initialLocations);
    console.log(`Created ${createdLocations.length} locations`);

    // Display created locations
    console.log('\nCreated locations:');
    createdLocations.forEach(location => {
      console.log(`- ${location.name} (${location.code}) - ${location.type}`);
    });

    console.log('\nLocation seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding locations:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedLocations(); 