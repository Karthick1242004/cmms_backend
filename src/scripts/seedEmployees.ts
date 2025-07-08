import Database from '../config/database';
import Employee from '../models/Employee';

const sampleEmployees = [
  {
    name: "John Anderson",
    email: "john.anderson@company.com",
    phone: "+1 (555) 123-4567",
    department: "Maintenance Engineering",
    role: "Department Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@company.com",
    phone: "+1 (555) 234-5678",
    department: "Operations & Production",
    role: "Production Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Robert Chen",
    email: "robert.chen@company.com",
    phone: "+1 (555) 345-6789",
    department: "Quality Assurance",
    role: "QA Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Maria Rodriguez",
    email: "maria.rodriguez@company.com",
    phone: "+1 (555) 456-7890",
    department: "Supply Chain & Logistics",
    role: "Logistics Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "David Wilson",
    email: "david.wilson@company.com",
    phone: "+1 (555) 567-8901",
    department: "Health & Safety",
    role: "Safety Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Emily Zhang",
    email: "emily.zhang@company.com",
    phone: "+1 (555) 678-9012",
    department: "IT Support & Systems",
    role: "IT Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Michael Brown",
    email: "michael.brown@company.com",
    phone: "+1 (555) 789-0123",
    department: "Human Resources",
    role: "HR Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    phone: "+1 (555) 890-1234",
    department: "Finance & Accounting",
    role: "Finance Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "James Kumar",
    email: "james.kumar@company.com",
    phone: "+1 (555) 901-2345",
    department: "Research & Development",
    role: "R&D Manager",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Amanda Green",
    email: "amanda.green@company.com",
    phone: "+1 (555) 012-3456",
    department: "Environmental Compliance",
    role: "Environmental Manager",
    status: "inactive",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Tom Johnson",
    email: "tom.johnson@company.com",
    phone: "+1 (555) 111-2222",
    department: "Maintenance Engineering",
    role: "Senior Technician",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Jennifer Lee",
    email: "jennifer.lee@company.com",
    phone: "+1 (555) 222-3333",
    department: "Maintenance Engineering",
    role: "Maintenance Technician",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Alex Thompson",
    email: "alex.thompson@company.com",
    phone: "+1 (555) 333-4444",
    department: "Operations & Production",
    role: "Production Supervisor",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Rachel Davis",
    email: "rachel.davis@company.com",
    phone: "+1 (555) 444-5555",
    department: "Quality Assurance",
    role: "Quality Inspector",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Mark Wilson",
    email: "mark.wilson@company.com",
    phone: "+1 (555) 555-6666",
    department: "Supply Chain & Logistics",
    role: "Warehouse Supervisor",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Sophie Chen",
    email: "sophie.chen@company.com",
    phone: "+1 (555) 666-7777",
    department: "Health & Safety",
    role: "Safety Officer",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Daniel Martinez",
    email: "daniel.martinez@company.com",
    phone: "+1 (555) 777-8888",
    department: "IT Support & Systems",
    role: "System Administrator",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Karen White",
    email: "karen.white@company.com",
    phone: "+1 (555) 888-9999",
    department: "Human Resources",
    role: "HR Specialist",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Ryan Garcia",
    email: "ryan.garcia@company.com",
    phone: "+1 (555) 999-0000",
    department: "Finance & Accounting",
    role: "Accountant",
    status: "active",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "Nicole Taylor",
    email: "nicole.taylor@company.com",
    phone: "+1 (555) 000-1111",
    department: "Research & Development",
    role: "Research Analyst",
    status: "active",
    avatar: "/placeholder-user.jpg"
  }
];

async function seedEmployees() {
  try {
    // Connect to database
    const database = Database.getInstance();
    await database.connect();

    // Clear existing employees (optional - remove if you want to keep existing data)
    console.log('🧹 Clearing existing employees...');
    await Employee.deleteMany({});

    // Insert sample employees
    console.log('🌱 Seeding employees...');
    const insertedEmployees = await Employee.insertMany(sampleEmployees);

    console.log(`✅ Successfully seeded ${insertedEmployees.length} employees:`);
    insertedEmployees.forEach((emp, index) => {
      console.log(`   ${index + 1}. ${emp.name} - ${emp.department} (${emp.role})`);
    });

    // Display database info
    const connectionInfo = await database.getConnectionInfo();
    console.log('\n📊 Database Information:');
    console.log(`   Database: ${connectionInfo.name}`);
    console.log(`   Collections: ${connectionInfo.collections?.map((c: any) => c.name).join(', ')}`);

    // Get employee statistics
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          activeEmployees: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          inactiveEmployees: {
            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
          },
        }
      }
    ]);

    // Get department breakdown
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    if (stats.length > 0) {
      console.log('\n📈 Employee Statistics:');
      console.log(`   Total Employees: ${stats[0].totalEmployees}`);
      console.log(`   Active Employees: ${stats[0].activeEmployees}`);
      console.log(`   Inactive Employees: ${stats[0].inactiveEmployees}`);
      
      console.log('\n📊 Department Breakdown:');
      departmentStats.forEach((dept, index) => {
        console.log(`   ${index + 1}. ${dept._id}: ${dept.count} employees (${dept.activeCount} active)`);
      });
    }

    await database.disconnect();
    console.log('\n🎉 Employee seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    process.exit(1);
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedEmployees();
}

export default seedEmployees; 