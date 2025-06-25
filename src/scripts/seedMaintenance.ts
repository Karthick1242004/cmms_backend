import Database from '../config/database';
import MaintenanceSchedule from '../models/MaintenanceSchedule';
import MaintenanceRecord from '../models/MaintenanceRecord';

const maintenanceScheduleSampleData = [
  {
    assetId: 'PUMP-001',
    assetName: 'Primary Water Pump',
    assetTag: 'WP-001',
    assetType: 'Pump',
    location: 'Building A - Basement',
    title: 'Monthly Pump Inspection and Lubrication',
    description: 'Comprehensive inspection of water pump system including lubrication of moving parts, checking seals, and testing performance.',
    frequency: 'monthly',
    startDate: new Date('2024-01-15'),
    nextDueDate: new Date('2024-12-15'),
    priority: 'high',
    estimatedDuration: 2.5,
    assignedTechnician: 'John Smith',
    status: 'active',
    createdBy: 'Admin',
    parts: [
      {
        partId: 'LUBRICANT-001',
        partName: 'Industrial Bearing Grease',
        partSku: 'GREASE-IND-500G',
        estimatedTime: 30,
        requiresReplacement: false,
        checklistItems: [
          {
            description: 'Check current grease condition',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Apply fresh grease to all bearing points',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Clean excess grease from surfaces',
            isRequired: true,
            status: 'pending'
          }
        ]
      },
      {
        partId: 'SEAL-001',
        partName: 'Pump Shaft Seal',
        partSku: 'SEAL-PS-25MM',
        estimatedTime: 45,
        requiresReplacement: true,
        replacementFrequency: 6,
        checklistItems: [
          {
            description: 'Inspect seal for wear and leakage',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Replace seal if damaged',
            isRequired: false,
            status: 'pending'
          },
          {
            description: 'Test seal integrity after installation',
            isRequired: true,
            status: 'pending'
          }
        ]
      }
    ]
  },
  {
    assetId: 'HVAC-002',
    assetName: 'Main HVAC Unit',
    assetTag: 'HVAC-M-002',
    assetType: 'HVAC',
    location: 'Building B - Rooftop',
    title: 'Quarterly HVAC Filter Replacement',
    description: 'Replace air filters and inspect HVAC system components for optimal performance.',
    frequency: 'quarterly',
    startDate: new Date('2024-01-01'),
    nextDueDate: new Date('2024-12-01'),
    priority: 'medium',
    estimatedDuration: 1.5,
    assignedTechnician: 'Sarah Johnson',
    status: 'active',
    createdBy: 'Admin',
    parts: [
      {
        partId: 'FILTER-001',
        partName: 'HEPA Air Filter',
        partSku: 'HEPA-20X25X4',
        estimatedTime: 20,
        requiresReplacement: true,
        replacementFrequency: 1,
        checklistItems: [
          {
            description: 'Remove old filters',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Install new HEPA filters',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Check filter fit and seal',
            isRequired: true,
            status: 'pending'
          }
        ]
      }
    ]
  },
  {
    assetId: 'CONV-003',
    assetName: 'Production Line Conveyor',
    assetTag: 'CNV-PL-003',
    assetType: 'Conveyor',
    location: 'Production Floor - Line 1',
    title: 'Weekly Conveyor Belt Inspection',
    description: 'Inspect conveyor belt for wear, alignment, and proper tension.',
    frequency: 'weekly',
    startDate: new Date('2024-11-01'),
    nextDueDate: new Date('2024-11-25'),
    priority: 'critical',
    estimatedDuration: 1.0,
    assignedTechnician: 'Mike Davis',
    status: 'overdue',
    createdBy: 'Admin',
    parts: [
      {
        partId: 'BELT-001',
        partName: 'Conveyor Belt',
        partSku: 'BELT-CV-10M',
        estimatedTime: 90,
        requiresReplacement: true,
        replacementFrequency: 12,
        checklistItems: [
          {
            description: 'Check belt tension',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Inspect for cracks or tears',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Verify belt alignment',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Test emergency stop function',
            isRequired: true,
            status: 'pending'
          }
        ]
      }
    ]
  },
  {
    assetId: 'GEN-004',
    assetName: 'Emergency Generator',
    assetTag: 'GEN-EM-004',
    assetType: 'Generator',
    location: 'Building C - Generator Room',
    title: 'Annual Generator Comprehensive Service',
    description: 'Complete annual service including oil change, fuel system check, and load testing.',
    frequency: 'annually',
    startDate: new Date('2024-03-01'),
    nextDueDate: new Date('2025-03-01'),
    priority: 'high',
    estimatedDuration: 4.0,
    assignedTechnician: 'Robert Wilson',
    status: 'active',
    createdBy: 'Admin',
    parts: [
      {
        partId: 'OIL-001',
        partName: 'Engine Oil 15W-40',
        partSku: 'OIL-15W40-5L',
        estimatedTime: 60,
        requiresReplacement: true,
        replacementFrequency: 1,
        checklistItems: [
          {
            description: 'Drain old engine oil',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Replace oil filter',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Add new engine oil',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Check oil level and quality',
            isRequired: true,
            status: 'pending'
          }
        ]
      },
      {
        partId: 'SPARK-001',
        partName: 'Spark Plugs',
        partSku: 'SPARK-NGK-BPR6ES',
        estimatedTime: 45,
        requiresReplacement: true,
        replacementFrequency: 2,
        checklistItems: [
          {
            description: 'Remove old spark plugs',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Install new spark plugs',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Set proper gap',
            isRequired: true,
            status: 'pending'
          }
        ]
      }
    ]
  },
  {
    assetId: 'COMP-005',
    assetName: 'Air Compressor Unit',
    assetTag: 'COMP-AIR-005',
    assetType: 'Compressor',
    location: 'Utility Room - Level 2',
    title: 'Daily Compressor Pressure Check',
    description: 'Daily inspection of air compressor pressure levels and safety systems.',
    frequency: 'daily',
    startDate: new Date('2024-12-01'),
    nextDueDate: new Date('2024-12-02'),
    priority: 'medium',
    estimatedDuration: 0.5,
    assignedTechnician: 'Lisa Anderson',
    status: 'active',
    createdBy: 'Admin',
    parts: [
      {
        partId: 'GAUGE-001',
        partName: 'Pressure Gauge',
        partSku: 'GAUGE-0-200PSI',
        estimatedTime: 15,
        requiresReplacement: false,
        checklistItems: [
          {
            description: 'Check pressure gauge reading',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Verify safety valve operation',
            isRequired: true,
            status: 'pending'
          },
          {
            description: 'Listen for unusual noises',
            isRequired: true,
            status: 'pending'
          }
        ]
      }
    ]
  }
];

const maintenanceRecordSampleData = [
  {
    scheduleId: '', // Will be set after creating schedules
    assetId: 'PUMP-001',
    assetName: 'Primary Water Pump',
    completedDate: new Date('2024-11-15'),
    startTime: '09:00',
    endTime: '11:30',
    actualDuration: 2.5,
    technician: 'John Smith',
    technicianId: 'TECH-001',
    status: 'completed',
    overallCondition: 'good',
    notes: 'Pump is operating within normal parameters. Replaced shaft seal as a preventive measure.',
    adminVerified: true,
    adminVerifiedBy: 'Admin Manager',
    adminVerifiedAt: new Date('2024-11-16'),
    adminNotes: 'Work completed satisfactorily. Next maintenance due in 30 days.',
    partsStatus: [
      {
        partId: 'LUBRICANT-001',
        partName: 'Industrial Bearing Grease',
        replaced: false,
        condition: 'good',
        timeSpent: 30,
        checklistItems: [
          {
            itemId: 'item-1',
            description: 'Check current grease condition',
            completed: true,
            status: 'completed',
            notes: 'Grease condition acceptable'
          },
          {
            itemId: 'item-2',
            description: 'Apply fresh grease to all bearing points',
            completed: true,
            status: 'completed'
          },
          {
            itemId: 'item-3',
            description: 'Clean excess grease from surfaces',
            completed: true,
            status: 'completed'
          }
        ]
      },
      {
        partId: 'SEAL-001',
        partName: 'Pump Shaft Seal',
        replaced: true,
        replacementPartId: 'SEAL-001-NEW',
        replacementNotes: 'Replaced as preventive maintenance',
        condition: 'excellent',
        timeSpent: 45,
        checklistItems: [
          {
            itemId: 'item-4',
            description: 'Inspect seal for wear and leakage',
            completed: true,
            status: 'completed',
            notes: 'Old seal showing signs of wear'
          },
          {
            itemId: 'item-5',
            description: 'Replace seal if damaged',
            completed: true,
            status: 'completed'
          },
          {
            itemId: 'item-6',
            description: 'Test seal integrity after installation',
            completed: true,
            status: 'completed',
            notes: 'No leakage detected'
          }
        ]
      }
    ]
  },
  {
    scheduleId: '', // Will be set after creating schedules
    assetId: 'HVAC-002',
    assetName: 'Main HVAC Unit',
    completedDate: new Date('2024-11-20'),
    startTime: '14:00',
    endTime: '15:30',
    actualDuration: 1.5,
    technician: 'Sarah Johnson',
    technicianId: 'TECH-002',
    status: 'completed',
    overallCondition: 'excellent',
    notes: 'All filters replaced successfully. System running efficiently.',
    adminVerified: false,
    partsStatus: [
      {
        partId: 'FILTER-001',
        partName: 'HEPA Air Filter',
        replaced: true,
        replacementPartId: 'FILTER-001-NEW',
        condition: 'excellent',
        timeSpent: 20,
        checklistItems: [
          {
            itemId: 'item-7',
            description: 'Remove old filters',
            completed: true,
            status: 'completed'
          },
          {
            itemId: 'item-8',
            description: 'Install new HEPA filters',
            completed: true,
            status: 'completed'
          },
          {
            itemId: 'item-9',
            description: 'Check filter fit and seal',
            completed: true,
            status: 'completed',
            notes: 'Perfect fit, no gaps detected'
          }
        ]
      }
    ]
  },
  {
    scheduleId: '', // Will be set after creating schedules
    assetId: 'CONV-003',
    assetName: 'Production Line Conveyor',
    completedDate: new Date('2024-11-22'),
    startTime: '08:00',
    endTime: '08:45',
    actualDuration: 0.75,
    technician: 'Mike Davis',
    technicianId: 'TECH-003',
    status: 'partially_completed',
    overallCondition: 'fair',
    notes: 'Belt tension adjusted. Minor wear detected on belt edge. Recommend replacement within 2 weeks.',
    adminVerified: false,
    partsStatus: [
      {
        partId: 'BELT-001',
        partName: 'Conveyor Belt',
        replaced: false,
        condition: 'fair',
        timeSpent: 45,
        checklistItems: [
          {
            itemId: 'item-10',
            description: 'Check belt tension',
            completed: true,
            status: 'completed',
            notes: 'Tension adjusted to specifications'
          },
          {
            itemId: 'item-11',
            description: 'Inspect for cracks or tears',
            completed: true,
            status: 'completed',
            notes: 'Minor edge wear detected'
          },
          {
            itemId: 'item-12',
            description: 'Verify belt alignment',
            completed: true,
            status: 'completed'
          },
          {
            itemId: 'item-13',
            description: 'Test emergency stop function',
            completed: false,
            status: 'failed',
            notes: 'Emergency stop response delayed - requires electrical check'
          }
        ]
      }
    ]
  }
];

async function seedMaintenanceData() {
  try {
    console.log('🌱 Starting maintenance data seeding...');

    // Connect to database
    const database = Database.getInstance();
    await database.connect();

    // Clear existing data
    console.log('📝 Clearing existing maintenance data...');
    await MaintenanceRecord.deleteMany({});
    await MaintenanceSchedule.deleteMany({});

    // Insert maintenance schedules
    console.log('📋 Inserting maintenance schedules...');
    const createdSchedules = await MaintenanceSchedule.insertMany(maintenanceScheduleSampleData);
    console.log(`✅ Created ${createdSchedules.length} maintenance schedules`);

    // Update record sample data with actual schedule IDs
    const updatedRecordData = maintenanceRecordSampleData.map((record, index) => ({
      ...record,
      scheduleId: createdSchedules[index]?._id?.toString() || createdSchedules[0]?._id?.toString() || ''
    }));

    // Insert maintenance records
    console.log('📊 Inserting maintenance records...');
    const createdRecords = await MaintenanceRecord.insertMany(updatedRecordData);
    console.log(`✅ Created ${createdRecords.length} maintenance records`);

    // Display summary
    console.log('\n📈 Seeding Summary:');
    console.log(`   Maintenance Schedules: ${createdSchedules.length}`);
    console.log(`   Maintenance Records: ${createdRecords.length}`);
    console.log('   Asset Types: Pump, HVAC, Conveyor, Generator, Compressor');
    console.log('   Frequencies: Daily, Weekly, Monthly, Quarterly, Annually');
    console.log('   Priorities: Low, Medium, High, Critical');
    console.log('   Statuses: Active, Overdue, Completed');

    console.log('\n🎉 Maintenance data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding maintenance data:', error);
    throw error;
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedMaintenanceData()
    .then(() => {
      console.log('✨ Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedMaintenanceData; 