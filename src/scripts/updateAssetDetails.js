const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('dotenv').config();

// Asset data updates
const assetUpdates = {
  // Heavy Duty Wrench Set (Metric)
  "686a878b7f3702025ef04760": {
    partsBOM: [
      {
        id: "part_001",
        partName: "10mm Wrench",
        partNumber: "WR-10MM-001",
        quantity: 1,
        unitCost: 12.99,
        supplier: "Tool Supply Co",
        lastReplaced: "2024-01-15",
        nextMaintenanceDate: "2024-07-15"
      },
      {
        id: "part_002", 
        partName: "12mm Wrench",
        partNumber: "WR-12MM-001",
        quantity: 1,
        unitCost: 13.99,
        supplier: "Tool Supply Co",
        lastReplaced: "2024-01-15",
        nextMaintenanceDate: "2024-07-15"
      },
      {
        id: "part_003",
        partName: "Storage Case",
        partNumber: "CASE-METRIC-001",
        quantity: 1,
        unitCost: 25.00,
        supplier: "Tool Supply Co",
        lastReplaced: "2023-01-01",
        nextMaintenanceDate: "2025-01-01"
      }
    ],
    meteringEvents: [
      {
        id: "meter_001",
        eventType: "Usage Count",
        reading: 245,
        unit: "uses",
        recordedDate: "2024-12-01",
        recordedBy: "Mike Johnson",
        notes: "Regular usage tracking"
      },
      {
        id: "meter_002",
        eventType: "Condition Check",
        reading: 85,
        unit: "percent",
        recordedDate: "2024-11-15",
        recordedBy: "Sarah Wilson",
        notes: "Overall condition assessment"
      }
    ],
    personnel: [
      {
        id: "person_001",
        name: "Mike Johnson",
        role: "Tool Crib Manager",
        email: "mike.johnson@company.com",
        phone: "+1-555-0123",
        assignedDate: "2023-01-01",
        responsibilities: ["Tool maintenance", "Inventory management"]
      },
      {
        id: "person_002",
        name: "Sarah Wilson",
        role: "Quality Inspector",
        email: "sarah.wilson@company.com", 
        phone: "+1-555-0124",
        assignedDate: "2023-02-15",
        responsibilities: ["Quality inspections", "Tool certification"]
      }
    ],
    warrantyDetails: {
      provider: "Craftsman",
      type: "Manufacturer Warranty",
      startDate: "2022-12-15",
      endDate: "2024-12-15",
      coverage: "Defects in materials and workmanship",
      contactInfo: "1-800-CRAFTSMAN",
      terms: "2-year limited warranty against manufacturing defects",
      claimHistory: [
        {
          claimNumber: "CW-2024-001",
          date: "2024-03-10",
          issue: "Bent 14mm wrench",
          status: "Resolved - Replacement sent"
        }
      ]
    },
    businesses: [
      {
        id: "business_001",
        name: "Tool Supply Co",
        type: "Supplier",
        contactPerson: "David Chen",
        phone: "+1-555-0200",
        email: "david@toolsupply.com",
        address: "123 Industrial Ave, Chicago, IL",
        relationship: "Primary tool supplier"
      },
      {
        id: "business_002",
        name: "Industrial Services Inc",
        type: "Service Provider",
        contactPerson: "Lisa Rodriguez",
        phone: "+1-555-0201",
        email: "lisa@indservices.com",
        address: "456 Service St, Chicago, IL",
        relationship: "Tool calibration and repair"
      }
    ],
    files: [
      {
        id: "file_001",
        name: "Tool_Manual_HDWS_M_001.pdf",
        type: "Manual",
        size: "2.3MB",
        uploadDate: "2023-01-01",
        uploadedBy: "Mike Johnson",
        category: "Documentation",
        description: "User manual and maintenance guide"
      },
      {
        id: "file_002",
        name: "Calibration_Certificate_2024.pdf",
        type: "Certificate",
        size: "1.1MB",
        uploadDate: "2024-01-15",
        uploadedBy: "Sarah Wilson",
        category: "Certification",
        description: "Annual calibration certificate"
      },
      {
        id: "file_003",
        name: "Purchase_Receipt_Dec2022.pdf",
        type: "Receipt",
        size: "0.8MB",
        uploadDate: "2022-12-15",
        uploadedBy: "Finance Dept",
        category: "Financial",
        description: "Original purchase receipt"
      }
    ],
    financials: {
      totalCostOfOwnership: 180.50,
      annualOperatingCost: 25.00,
      depreciationRate: 0.20,
      currentBookValue: 72.00,
      maintenanceCostYTD: 15.00,
      fuelCostYTD: 0
    },
    purchaseInfo: {
      purchaseOrderNumber: "PO-2022-1215",
      vendor: "Tool Supply Co",
      requestedBy: "Mike Johnson",
      approvedBy: "Operations Manager",
      purchaseDate: "2022-12-15",
      deliveryDate: "2022-12-20",
      invoiceNumber: "INV-TSC-2022-5678"
    },
    associatedCustomer: {
      id: "cust_001",
      name: "Internal - Maintenance Department",
      type: "Internal Department",
      contactPerson: "Mike Johnson",
      email: "mike.johnson@company.com",
      projects: ["General Maintenance", "Equipment Repair"]
    },
    log: [
      {
        id: "log_001",
        date: "2024-12-01",
        action: "Usage Recorded",
        performedBy: "Mike Johnson",
        details: "Used for equipment maintenance - 3 hours",
        category: "Usage"
      },
      {
        id: "log_002",
        date: "2024-11-15",
        action: "Condition Assessment",
        performedBy: "Sarah Wilson",
        details: "Overall condition rated at 85% - good working order",
        category: "Inspection"
      },
      {
        id: "log_003",
        date: "2024-03-10",
        action: "Warranty Claim",
        performedBy: "Mike Johnson",
        details: "Filed warranty claim for bent 14mm wrench",
        category: "Warranty"
      }
    ]
  },

  // The Cat® 416F2 Backhoe Loader
  "686a878b7f3702025ef04761": {
    partsBOM: [
      {
        id: "part_101",
        partName: "Engine Oil Filter",
        partNumber: "CAT-1R-0716",
        quantity: 2,
        unitCost: 45.99,
        supplier: "Caterpillar Inc",
        lastReplaced: "2024-10-15",
        nextMaintenanceDate: "2025-01-15"
      },
      {
        id: "part_102",
        partName: "Hydraulic Oil Filter",
        partNumber: "CAT-9T-9054",
        quantity: 1,
        unitCost: 89.99,
        supplier: "Caterpillar Inc",
        lastReplaced: "2024-08-20",
        nextMaintenanceDate: "2025-02-20"
      },
      {
        id: "part_103",
        partName: "Front Bucket Teeth",
        partNumber: "CAT-1U-3252",
        quantity: 5,
        unitCost: 125.00,
        supplier: "Heavy Equipment Parts",
        lastReplaced: "2024-09-05",
        nextMaintenanceDate: "2025-03-05"
      },
      {
        id: "part_104",
        partName: "Rubber Track Pads",
        partNumber: "CAT-3G-8142",
        quantity: 4,
        unitCost: 350.00,
        supplier: "Caterpillar Inc",
        lastReplaced: "2024-06-10",
        nextMaintenanceDate: "2025-06-10"
      }
    ],
    meteringEvents: [
      {
        id: "meter_101",
        eventType: "Engine Hours",
        reading: 1247,
        unit: "hours",
        recordedDate: "2024-12-01",
        recordedBy: "Tracy Desmond",
        notes: "Daily hours reading"
      },
      {
        id: "meter_102",
        eventType: "Fuel Consumption",
        reading: 2450,
        unit: "gallons",
        recordedDate: "2024-12-01",
        recordedBy: "Fleet Manager",
        notes: "Monthly fuel consumption"
      },
      {
        id: "meter_103",
        eventType: "Hydraulic Pressure",
        reading: 3200,
        unit: "PSI",
        recordedDate: "2024-11-30",
        recordedBy: "Service Technician",
        notes: "Weekly hydraulic system check"
      }
    ],
    personnel: [
      {
        id: "person_101",
        name: "Tracy Desmond",
        role: "Primary Operator",
        email: "kate09mark@gmail.com",
        phone: "+1-555-0301",
        assignedDate: "2022-09-10",
        responsibilities: ["Equipment operation", "Daily inspections", "Basic maintenance"]
      },
      {
        id: "person_102",
        name: "Robert Martinez",
        role: "Service Technician",
        email: "robert.martinez@company.com",
        phone: "+1-555-0302",
        assignedDate: "2022-09-07",
        responsibilities: ["Scheduled maintenance", "Repairs", "Technical support"]
      },
      {
        id: "person_103",
        name: "Jennifer Lee",
        role: "Fleet Manager",
        email: "jennifer.lee@company.com",
        phone: "+1-555-0303",
        assignedDate: "2022-09-01",
        responsibilities: ["Fleet oversight", "Maintenance scheduling", "Cost management"]
      }
    ],
    warrantyDetails: {
      provider: "Caterpillar Inc",
      type: "Extended Warranty",
      startDate: "2022-09-07",
      endDate: "2025-09-07",
      coverage: "Engine, hydraulics, transmission, and major components",
      contactInfo: "1-800-CATERPILLAR",
      terms: "3-year comprehensive warranty with 24/7 support",
      claimHistory: [
        {
          claimNumber: "CAT-2024-0892",
          date: "2024-05-20",
          issue: "Hydraulic cylinder seal leak",
          status: "Resolved - Seal replaced under warranty"
        },
        {
          claimNumber: "CAT-2023-1156",
          date: "2023-11-12",
          issue: "Engine temperature sensor malfunction",
          status: "Resolved - Sensor replaced"
        }
      ]
    },
    businesses: [
      {
        id: "business_101",
        name: "Caterpillar Inc",
        type: "Manufacturer/Dealer",
        contactPerson: "Michael Thompson",
        phone: "+1-555-0400",
        email: "michael.thompson@cat.com",
        address: "500 Lake Cook Rd, Deerfield, IL",
        relationship: "Authorized dealer and service provider"
      },
      {
        id: "business_102",
        name: "Heavy Equipment Parts",
        type: "Parts Supplier",
        contactPerson: "Amanda Foster",
        phone: "+1-555-0401",
        email: "amanda@heavyparts.com",
        address: "789 Industrial Blvd, Detroit, MI",
        relationship: "Alternative parts supplier"
      },
      {
        id: "business_103",
        name: "Equipment Leasing Corp",
        type: "Financial Services",
        contactPerson: "Steven Davis",
        phone: "+1-555-0402",
        email: "steven@equipleasing.com",
        address: "321 Finance Ave, New York, NY",
        relationship: "Equipment financing partner"
      }
    ],
    files: [
      {
        id: "file_101",
        name: "CAT_416F2_Operations_Manual.pdf",
        type: "Manual",
        size: "15.2MB",
        uploadDate: "2022-09-07",
        uploadedBy: "Robert Martinez",
        category: "Documentation",
        description: "Complete operations and maintenance manual"
      },
      {
        id: "file_102",
        name: "Inspection_Report_Dec2024.pdf",
        type: "Inspection",
        size: "3.4MB",
        uploadDate: "2024-12-01",
        uploadedBy: "Tracy Desmond",
        category: "Inspection",
        description: "Monthly safety and operational inspection"
      },
      {
        id: "file_103",
        name: "Service_Schedule_2024.xlsx",
        type: "Schedule",
        size: "1.8MB",
        uploadDate: "2024-01-01",
        uploadedBy: "Jennifer Lee",
        category: "Maintenance",
        description: "Annual service and maintenance schedule"
      },
      {
        id: "file_104",
        name: "Purchase_Contract_2022.pdf",
        type: "Contract",
        size: "4.1MB",
        uploadDate: "2022-09-01",
        uploadedBy: "Finance Dept",
        category: "Financial",
        description: "Original purchase agreement and financing terms"
      }
    ],
    financials: {
      totalCostOfOwnership: 125000,
      annualOperatingCost: 18500,
      depreciationRate: 0.12,
      currentBookValue: 58000,
      maintenanceCostYTD: 8750,
      fuelCostYTD: 12400
    },
    purchaseInfo: {
      purchaseOrderNumber: "PO-2022-0901",
      vendor: "Caterpillar Inc",
      requestedBy: "Jennifer Lee",
      approvedBy: "Operations Director",
      purchaseDate: "2022-09-01",
      deliveryDate: "2022-09-07",
      invoiceNumber: "INV-CAT-2022-A6381949"
    },
    associatedCustomer: {
      id: "cust_101",
      name: "City Construction Project",
      type: "External Client",
      contactPerson: "Mark Johnson",
      email: "mark.johnson@cityconstruction.com",
      projects: ["Main Street Renovation", "Park Development", "Utility Installation"]
    },
    log: [
      {
        id: "log_101",
        date: "2024-12-01",
        action: "Daily Operation",
        performedBy: "Tracy Desmond",
        details: "Operated for 8.5 hours - excavation work at Main Street project",
        category: "Operation"
      },
      {
        id: "log_102",
        date: "2024-11-25",
        action: "Scheduled Maintenance",
        performedBy: "Robert Martinez",
        details: "500-hour service completed - oil change, filter replacement, hydraulic check",
        category: "Maintenance"
      },
      {
        id: "log_103",
        date: "2024-11-20",
        action: "Safety Inspection",
        performedBy: "Safety Inspector",
        details: "Monthly safety inspection passed - all systems operational",
        category: "Inspection"
      },
      {
        id: "log_104",
        date: "2024-10-15",
        action: "Repair",
        performedBy: "Robert Martinez",
        details: "Replaced worn bucket teeth - improved digging efficiency",
        category: "Repair"
      }
    ]
  }
};

async function updateAssetDetails() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://karthick1242004:9894783774@karthick124.8ruyxjc.mongodb.net/cmms');
    
    const db = mongoose.connection.db;
    const assetsCollection = db.collection('assets');
    
    for (const [assetId, updateData] of Object.entries(assetUpdates)) {
      console.log(`\nUpdating asset: ${assetId}`);
      
      const result = await assetsCollection.updateOne(
        { _id: new ObjectId(assetId) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ Successfully updated asset ${assetId}`);
      } else {
        console.log(`❌ Asset ${assetId} not found`);
      }
    }
    
    console.log('\n✨ Asset details update completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error updating asset details:', error);
    process.exit(1);
  }
}

updateAssetDetails(); 