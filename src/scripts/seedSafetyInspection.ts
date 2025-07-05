import mongoose from 'mongoose';
import SafetyInspectionSchedule from '../models/SafetyInspectionSchedule';
import SafetyInspectionRecord from '../models/SafetyInspectionRecord';

const sampleSafetyInspectionSchedules = [
  {
    assetId: '1',
    assetName: 'Manufacturing Line A',
    assetTag: 'MLA-001',
    assetType: 'Production Equipment',
    location: 'Factory Floor - Section A',
    title: 'Monthly Safety Inspection',
    description: 'Comprehensive safety inspection covering all safety protocols, emergency systems, and worker protection measures.',
    frequency: 'monthly',
    startDate: new Date('2024-01-01'),
    nextDueDate: new Date('2024-02-01'),
    lastCompletedDate: new Date('2024-01-01'),
    priority: 'high',
    riskLevel: 'high',
    estimatedDuration: 3,
    assignedInspector: 'Sarah Johnson',
    safetyStandards: ['OSHA', 'ISO45001'],
    status: 'active',
    createdBy: 'safety@company.com',
    checklistCategories: [
      {
        categoryName: 'Emergency Systems',
        description: 'Fire safety, emergency exits, and alarm systems',
        required: true,
        weight: 30,
        checklistItems: [
          {
            description: 'Verify fire extinguishers are in place and charged',
            safetyStandard: 'OSHA',
            isRequired: true,
            riskLevel: 'critical',
            status: 'pending',
          },
          {
            description: 'Check emergency exit signs are illuminated',
            safetyStandard: 'OSHA',
            isRequired: true,
            riskLevel: 'high',
            status: 'pending',
          },
          {
            description: 'Test emergency alarm system',
            safetyStandard: 'ISO45001',
            isRequired: true,
            riskLevel: 'high',
            status: 'pending',
          },
        ],
      },
      {
        categoryName: 'Personal Protective Equipment',
        description: 'PPE availability and condition',
        required: true,
        weight: 25,
        checklistItems: [
          {
            description: 'Inspect hard hats for damage',
            isRequired: true,
            riskLevel: 'medium',
            status: 'pending',
          },
          {
            description: 'Check safety glasses inventory',
            isRequired: true,
            riskLevel: 'medium',
            status: 'pending',
          },
          {
            description: 'Verify first aid kit is stocked',
            safetyStandard: 'OSHA',
            isRequired: true,
            riskLevel: 'high',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    assetId: '2',
    assetName: 'Chemical Storage Area',
    assetTag: 'CSA-001',
    assetType: 'Storage Facility',
    location: 'Building B - Ground Floor',
    title: 'Weekly Chemical Safety Inspection',
    description: 'Safety inspection of chemical storage area including ventilation, containment, and labeling compliance.',
    frequency: 'weekly',
    startDate: new Date('2024-01-01'),
    nextDueDate: new Date('2023-12-25'), // Overdue for demo
    lastCompletedDate: new Date('2023-12-18'),
    priority: 'critical',
    riskLevel: 'critical',
    estimatedDuration: 2,
    assignedInspector: 'Mike Chen',
    safetyStandards: ['OSHA', 'EPA', 'NFPA'],
    status: 'overdue',
    createdBy: 'safety@company.com',
    checklistCategories: [
      {
        categoryName: 'Chemical Storage',
        description: 'Proper storage and labeling of chemicals',
        required: true,
        weight: 40,
        checklistItems: [
          {
            description: 'Verify all chemicals are properly labeled',
            safetyStandard: 'OSHA',
            isRequired: true,
            riskLevel: 'critical',
            status: 'pending',
          },
          {
            description: 'Check chemical segregation compliance',
            safetyStandard: 'NFPA',
            isRequired: true,
            riskLevel: 'critical',
            status: 'pending',
          },
          {
            description: 'Inspect storage containers for leaks',
            isRequired: true,
            riskLevel: 'high',
            status: 'pending',
          },
        ],
      },
      {
        categoryName: 'Ventilation Systems',
        description: 'Air quality and ventilation effectiveness',
        required: true,
        weight: 35,
        checklistItems: [
          {
            description: 'Test ventilation system operation',
            safetyStandard: 'OSHA',
            isRequired: true,
            riskLevel: 'high',
            status: 'pending',
          },
          {
            description: 'Check air quality monitoring systems',
            isRequired: true,
            riskLevel: 'medium',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    assetId: '3',
    assetName: 'Loading Dock',
    assetTag: 'LD-001',
    assetType: 'Loading Area',
    location: 'Building C - Rear',
    title: 'Daily Safety Walk-through',
    description: 'Daily safety inspection of loading dock area focusing on slip hazards, equipment operation, and traffic safety.',
    frequency: 'daily',
    startDate: new Date('2024-01-01'),
    nextDueDate: new Date('2024-01-29'),
    lastCompletedDate: new Date('2024-01-28'),
    priority: 'medium',
    riskLevel: 'medium',
    estimatedDuration: 0.5,
    assignedInspector: 'Tom Rodriguez',
    safetyStandards: ['OSHA', 'Company Policy'],
    status: 'active',
    createdBy: 'safety@company.com',
    checklistCategories: [
      {
        categoryName: 'Loading Equipment',
        description: 'Forklifts, dock levelers, and safety equipment',
        required: true,
        weight: 50,
        checklistItems: [
          {
            description: 'Inspect forklift condition and safety features',
            isRequired: true,
            riskLevel: 'high',
            status: 'pending',
          },
          {
            description: 'Check dock leveler operation',
            isRequired: true,
            riskLevel: 'medium',
            status: 'pending',
          },
          {
            description: 'Verify wheel chocks are available',
            safetyStandard: 'OSHA',
            isRequired: true,
            riskLevel: 'high',
            status: 'pending',
          },
        ],
      },
    ],
  },
];

const sampleSafetyInspectionRecords = [
  {
    scheduleId: '', // Will be set after schedule creation
    assetId: '1',
    assetName: 'Manufacturing Line A',
    completedDate: new Date('2024-01-15'),
    startTime: '08:00',
    endTime: '11:00',
    actualDuration: 3,
    inspector: 'Sarah Johnson',
    inspectorId: 'insp_1',
    status: 'completed',
    overallComplianceScore: 95,
    complianceStatus: 'compliant',
    notes: 'Excellent safety compliance. All emergency systems operational. Minor issue with one hard hat that was replaced immediately.',
    adminVerified: false,
    correctiveActionsRequired: false,
    categoryResults: [
      {
        categoryId: '', // Will be set after schedule creation
        categoryName: 'Emergency Systems',
        weight: 30,
        categoryComplianceScore: 100,
        timeSpent: 90,
        checklistItems: [
          {
            itemId: '', // Will be set after schedule creation
            description: 'Verify fire extinguishers are in place and charged',
            safetyStandard: 'OSHA',
            completed: true,
            status: 'compliant',
            riskLevel: 'critical',
            notes: 'All 4 extinguishers fully charged and properly mounted',
          },
        ],
      },
    ],
    violations: [],
  },
];

export async function seedSafetyInspectionData() {
  try {
    console.log('🌱 Seeding safety inspection data...');

    // Clear existing data
    await SafetyInspectionSchedule.deleteMany({});
    await SafetyInspectionRecord.deleteMany({});

    console.log('✅ Cleared existing safety inspection data');

    // Insert schedules
    const createdSchedules = await SafetyInspectionSchedule.insertMany(sampleSafetyInspectionSchedules);
    console.log(`✅ Created ${createdSchedules.length} safety inspection schedules`);

    // Update records with actual schedule IDs
    if (createdSchedules.length > 0) {
      const firstSchedule = createdSchedules[0] as any;
      if (sampleSafetyInspectionRecords[0]) {
        sampleSafetyInspectionRecords[0].scheduleId = firstSchedule._id.toString();
        
        // Set category and item IDs
        if (firstSchedule.checklistCategories && firstSchedule.checklistCategories.length > 0) {
          const firstCategory = firstSchedule.checklistCategories[0] as any;
          if (sampleSafetyInspectionRecords[0].categoryResults[0]) {
            sampleSafetyInspectionRecords[0].categoryResults[0].categoryId = firstCategory._id.toString();
            
            if (firstCategory.checklistItems && firstCategory.checklistItems.length > 0 &&
                sampleSafetyInspectionRecords[0].categoryResults[0].checklistItems[0]) {
              sampleSafetyInspectionRecords[0].categoryResults[0].checklistItems[0].itemId = 
                firstCategory.checklistItems[0]._id.toString();
            }
          }
        }
      }

      // Insert records
      const createdRecords = await SafetyInspectionRecord.insertMany(sampleSafetyInspectionRecords);
      console.log(`✅ Created ${createdRecords.length} safety inspection records`);
    }

    console.log('🎉 Safety inspection data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding safety inspection data:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cmms')
    .then(async () => {
      console.log('📦 Connected to MongoDB');
      await seedSafetyInspectionData();
      await mongoose.disconnect();
      console.log('📦 Disconnected from MongoDB');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database connection error:', error);
      process.exit(1);
    });
} 