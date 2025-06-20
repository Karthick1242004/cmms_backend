import mongoose from 'mongoose';
import ShiftDetail from '../models/ShiftDetail';
import Database from '../config/database';

const sampleShiftDetails = [
  {
    employeeId: 1001,
    employeeName: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0123',
    department: 'Maintenance',
    role: 'Senior Technician',
    shiftType: 'day',
    shiftStartTime: '08:00',
    shiftEndTime: '16:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    supervisor: 'Michael Johnson',
    location: 'Building A',
    status: 'active',
    joinDate: '2023-01-15',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    employeeId: 1002,
    employeeName: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1-555-0124',
    department: 'HVAC',
    role: 'HVAC Specialist',
    shiftType: 'night',
    shiftStartTime: '22:00',
    shiftEndTime: '06:00',
    workDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    supervisor: 'David Brown',
    location: 'Building B',
    status: 'active',
    joinDate: '2023-02-01',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    employeeId: 1003,
    employeeName: 'Mike Davis',
    email: 'mike.davis@company.com',
    phone: '+1-555-0125',
    department: 'Electrical',
    role: 'Electrician',
    shiftType: 'rotating',
    shiftStartTime: '07:00',
    shiftEndTime: '15:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    supervisor: 'Lisa Anderson',
    location: 'All Buildings',
    status: 'active',
    joinDate: '2022-11-20',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    employeeId: 1004,
    employeeName: 'Emma Thompson',
    email: 'emma.thompson@company.com',
    phone: '+1-555-0126',
    department: 'Plumbing',
    role: 'Plumber',
    shiftType: 'day',
    shiftStartTime: '09:00',
    shiftEndTime: '17:00',
    workDays: ['Monday', 'Wednesday', 'Friday'],
    supervisor: 'Robert Taylor',
    location: 'Building C',
    status: 'on-leave',
    joinDate: '2023-03-10',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    employeeId: 1005,
    employeeName: 'James Rodriguez',
    email: 'james.rodriguez@company.com',
    phone: '+1-555-0127',
    department: 'Security',
    role: 'Security Guard',
    shiftType: 'night',
    shiftStartTime: '20:00',
    shiftEndTime: '04:00',
    workDays: ['Friday', 'Saturday', 'Sunday'],
    supervisor: 'Angela White',
    location: 'Building D',
    status: 'active',
    joinDate: '2022-08-15',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    employeeId: 1006,
    employeeName: 'Lisa Garcia',
    email: 'lisa.garcia@company.com',
    phone: '+1-555-0128',
    department: 'Cleaning',
    role: 'Cleaning Supervisor',
    shiftType: 'day',
    shiftStartTime: '06:00',
    shiftEndTime: '14:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    supervisor: 'Carlos Martinez',
    location: 'All Buildings',
    status: 'active',
    joinDate: '2023-04-01',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    employeeId: 1007,
    employeeName: 'Kevin Lee',
    email: 'kevin.lee@company.com',
    phone: '+1-555-0129',
    department: 'IT',
    role: 'IT Support Specialist',
    shiftType: 'on-call',
    shiftStartTime: '09:00',
    shiftEndTime: '17:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    supervisor: 'Nancy Wilson',
    location: 'Building A',
    status: 'active',
    joinDate: '2023-01-30',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    employeeId: 1008,
    employeeName: 'Maria Gonzalez',
    email: 'maria.gonzalez@company.com',
    phone: '+1-555-0130',
    department: 'Maintenance',
    role: 'Maintenance Assistant',
    shiftType: 'day',
    shiftStartTime: '08:30',
    shiftEndTime: '16:30',
    workDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    supervisor: 'Michael Johnson',
    location: 'Building B',
    status: 'inactive',
    joinDate: '2022-12-05',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    employeeId: 1009,
    employeeName: 'Daniel Kim',
    email: 'daniel.kim@company.com',
    phone: '+1-555-0131',
    department: 'HVAC',
    role: 'Junior HVAC Technician',
    shiftType: 'rotating',
    shiftStartTime: '16:00',
    shiftEndTime: '00:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    supervisor: 'David Brown',
    location: 'Building C',
    status: 'active',
    joinDate: '2023-05-15',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    employeeId: 1010,
    employeeName: 'Ashley Chen',
    email: 'ashley.chen@company.com',
    phone: '+1-555-0132',
    department: 'Security',
    role: 'Security Officer',
    shiftType: 'night',
    shiftStartTime: '00:00',
    shiftEndTime: '08:00',
    workDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    supervisor: 'Angela White',
    location: 'All Buildings',
    status: 'active',
    joinDate: '2023-02-20',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    employeeId: 1011,
    employeeName: 'Ryan Murphy',
    email: 'ryan.murphy@company.com',
    phone: '+1-555-0133',
    department: 'Electrical',
    role: 'Electrical Engineer',
    shiftType: 'day',
    shiftStartTime: '08:00',
    shiftEndTime: '16:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    supervisor: 'Lisa Anderson',
    location: 'Building D',
    status: 'active',
    joinDate: '2022-10-01',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    employeeId: 1012,
    employeeName: 'Jennifer Lopez',
    email: 'jennifer.lopez@company.com',
    phone: '+1-555-0134',
    department: 'Cleaning',
    role: 'Cleaner',
    shiftType: 'night',
    shiftStartTime: '18:00',
    shiftEndTime: '02:00',
    workDays: ['Saturday', 'Sunday'],
    supervisor: 'Carlos Martinez',
    location: 'Building A',
    status: 'on-leave',
    joinDate: '2023-06-01',
    avatar: 'https://i.pravatar.cc/150?img=12'
  }
];

async function seedShiftDetails() {
  try {
    console.log('🌱 Starting shift details seeding process...');
    
    // Connect to database
    const database = Database.getInstance();
    await database.connect();
    console.log('✅ Connected to database');

    // Clear existing shift details
    const deleteResult = await ShiftDetail.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing shift details`);

    // Insert sample data
    const insertedShiftDetails = await ShiftDetail.insertMany(sampleShiftDetails);
    console.log(`✅ Successfully inserted ${insertedShiftDetails.length} shift details`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Total shift details: ${insertedShiftDetails.length}`);
    
    const statusCounts = insertedShiftDetails.reduce((acc: any, shift) => {
      acc[shift.status] = (acc[shift.status] || 0) + 1;
      return acc;
    }, {});
    
    const shiftTypeCounts = insertedShiftDetails.reduce((acc: any, shift) => {
      acc[shift.shiftType] = (acc[shift.shiftType] || 0) + 1;
      return acc;
    }, {});

    console.log('   Status breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`);
    });

    console.log('   Shift type breakdown:');
    Object.entries(shiftTypeCounts).forEach(([type, count]) => {
      console.log(`     ${type}: ${count}`);
    });

    // Sample shift details for verification
    console.log('\n👥 Sample shift details created:');
    insertedShiftDetails.slice(0, 3).forEach((shift) => {
      console.log(`   ${shift.employeeName} (${shift.department}) - ${shift.shiftType} shift`);
    });

    console.log('\n🎉 Shift details seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding shift details:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedShiftDetails()
    .then(() => {
      console.log('✅ Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedShiftDetails; 