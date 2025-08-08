import mongoose from 'mongoose';
import Database from '../config/database';
import Department from '../models/Department';
import Employee from '../models/Employee';

interface DepartmentData {
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
  status: 'active' | 'inactive';
}

interface EmployeeData {
  name: string;
  email: string;
  password: string;
  role: string;
  accessLevel: 'department_admin' | 'normal_user';
  department: string;
  employeeId: string;
  phone: string;
  status: 'active' | 'inactive' | 'on-leave';
}

const departments: DepartmentData[] = [
  {
    name: 'Quality Assurance',
    description: 'Ensures product quality through testing, inspection, and compliance with industry standards and regulations.',
    manager: 'Dr. Emily Chen',
    employeeCount: 5,
    status: 'active'
  },
  {
    name: 'Production Engineering',
    description: 'Optimizes manufacturing processes, designs production systems, and ensures efficient workflow operations.',
    manager: 'Michael Rodriguez',
    employeeCount: 5,
    status: 'active'
  },
  {
    name: 'Information Technology',
    description: 'Manages IT infrastructure, software development, cybersecurity, and digital transformation initiatives.',
    manager: 'Alex Thompson',
    employeeCount: 5,
    status: 'active'
  }
];

const employees: EmployeeData[] = [
  // Quality Assurance Department
  {
    name: 'Dr. Emily Chen',
    email: 'emily.chen@company.com',
    password: 'manager123',
    role: 'QA Department Head',
    accessLevel: 'department_admin',
    department: 'Quality Assurance',
    employeeId: 'QA001',
    phone: '+1-555-0101',
    status: 'active'
  },
  {
    name: 'David Kumar',
    email: 'david.kumar@company.com',
    password: 'lead123',
    role: 'QA Team Lead',
    accessLevel: 'normal_user',
    department: 'Quality Assurance',
    employeeId: 'QA002',
    phone: '+1-555-0102',
    status: 'active'
  },
  {
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    password: 'user123',
    role: 'Quality Inspector',
    accessLevel: 'normal_user',
    department: 'Quality Assurance',
    employeeId: 'QA003',
    phone: '+1-555-0103',
    status: 'active'
  },
  {
    name: 'James Johnson',
    email: 'james.johnson@company.com',
    password: 'user123',
    role: 'Quality Analyst',
    accessLevel: 'normal_user',
    department: 'Quality Assurance',
    employeeId: 'QA004',
    phone: '+1-555-0104',
    status: 'active'
  },
  {
    name: 'Lisa Martinez',
    email: 'lisa.martinez@company.com',
    password: 'user123',
    role: 'Compliance Specialist',
    accessLevel: 'normal_user',
    department: 'Quality Assurance',
    employeeId: 'QA005',
    phone: '+1-555-0105',
    status: 'active'
  },
  
  // Production Engineering Department
  {
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@company.com',
    password: 'manager123',
    role: 'Production Engineering Head',
    accessLevel: 'department_admin',
    department: 'Production Engineering',
    employeeId: 'PE001',
    phone: '+1-555-0201',
    status: 'active'
  },
  {
    name: 'Jennifer Brown',
    email: 'jennifer.brown@company.com',
    password: 'lead123',
    role: 'Process Engineering Lead',
    accessLevel: 'normal_user',
    department: 'Production Engineering',
    employeeId: 'PE002',
    phone: '+1-555-0202',
    status: 'active'
  },
  {
    name: 'Robert Davis',
    email: 'robert.davis@company.com',
    password: 'user123',
    role: 'Production Engineer',
    accessLevel: 'normal_user',
    department: 'Production Engineering',
    employeeId: 'PE003',
    phone: '+1-555-0203',
    status: 'active'
  },
  {
    name: 'Amanda Wilson',
    email: 'amanda.wilson@company.com',
    password: 'user123',
    role: 'Manufacturing Specialist',
    accessLevel: 'normal_user',
    department: 'Production Engineering',
    employeeId: 'PE004',
    phone: '+1-555-0204',
    status: 'active'
  },
  {
    name: 'Daniel Taylor',
    email: 'daniel.taylor@company.com',
    password: 'user123',
    role: 'Process Optimization Analyst',
    accessLevel: 'normal_user',
    department: 'Production Engineering',
    employeeId: 'PE005',
    phone: '+1-555-0205',
    status: 'active'
  },
  
  // Information Technology Department
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    password: 'manager123',
    role: 'IT Department Head',
    accessLevel: 'department_admin',
    department: 'Information Technology',
    employeeId: 'IT001',
    phone: '+1-555-0301',
    status: 'active'
  },
  {
    name: 'Rachel Garcia',
    email: 'rachel.garcia@company.com',
    password: 'lead123',
    role: 'Software Development Lead',
    accessLevel: 'normal_user',
    department: 'Information Technology',
    employeeId: 'IT002',
    phone: '+1-555-0302',
    status: 'active'
  },
  {
    name: 'Christopher Lee',
    email: 'christopher.lee@company.com',
    password: 'user123',
    role: 'Full Stack Developer',
    accessLevel: 'normal_user',
    department: 'Information Technology',
    employeeId: 'IT003',
    phone: '+1-555-0303',
    status: 'active'
  },
  {
    name: 'Michelle White',
    email: 'michelle.white@company.com',
    password: 'user123',
    role: 'System Administrator',
    accessLevel: 'normal_user',
    department: 'Information Technology',
    employeeId: 'IT004',
    phone: '+1-555-0304',
    status: 'active'
  },
  {
    name: 'Kevin Anderson',
    email: 'kevin.anderson@company.com',
    password: 'user123',
    role: 'Cybersecurity Specialist',
    accessLevel: 'normal_user',
    department: 'Information Technology',
    employeeId: 'IT005',
    phone: '+1-555-0305',
    status: 'active'
  }
];

async function seedDepartmentsAndEmployees() {
  try {
    // Connect to database
    const database = Database.getInstance();
    await database.connect();
    console.log('✅ Connected to MongoDB');

    // Clear existing departments and employees (except super admin)
    console.log('🧹 Clearing existing departments and employees...');
    await (Department as any).deleteMany({});
    await (Employee as any).deleteMany({ accessLevel: { $ne: 'super_admin' } });

    console.log('📚 Creating departments...');
    const createdDepartments = await (Department as any).insertMany(departments);
    console.log(`✅ Created ${createdDepartments.length} departments`);

    console.log('👥 Creating employees...');
    
    for (const employeeData of employees) {
      // Create Employee (password will be hashed by pre-save middleware)
      const employee = new Employee({
        name: employeeData.name,
        email: employeeData.email,
        password: employeeData.password,
        role: employeeData.role,
        accessLevel: employeeData.accessLevel,
        department: employeeData.department,
        employeeId: employeeData.employeeId,
        phone: employeeData.phone,
        status: employeeData.status,
        joinDate: new Date()
      });
      await employee.save();

      console.log(`✅ Created ${employeeData.name} (${employeeData.accessLevel})`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`• Departments created: ${createdDepartments.length}`);
    console.log(`• Employees created: ${employees.length}`);
    console.log(`• Department Admins: ${employees.filter(e => e.accessLevel === 'department_admin').length}`);
    console.log(`• Team Leads: ${employees.filter(e => e.role.includes('Lead')).length}`);
    console.log(`• Normal Users: ${employees.filter(e => e.accessLevel === 'normal_user').length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedDepartmentsAndEmployees();
