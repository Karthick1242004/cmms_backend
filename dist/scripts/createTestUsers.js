"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Employee_1 = __importDefault(require("../models/Employee"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://karthick124:3ruyxjcpassword@cluster0.8ruyxjc.mongodb.net/cmms?retryWrites=true&w=majority';
async function createTestUsers() {
    try {
        console.log('Connecting to database...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to database successfully');
        console.log('Clearing existing employees...');
        await Employee_1.default.deleteMany({});
        const testUsers = [
            {
                name: 'Super Admin',
                email: 'admin@company.com',
                password: 'admin123',
                phone: '+1 (555) 001-0001',
                department: 'IT Support & Systems',
                role: 'System Administrator',
                status: 'active',
                avatar: '/placeholder-user.jpg',
                employeeId: 'EMP-ADMIN-001',
                joinDate: new Date('2023-01-01'),
                supervisor: null,
                accessLevel: 'super_admin',
                skills: ['System Administration', 'Network Management', 'Database Management'],
                certifications: ['CompTIA Security+', 'Microsoft Azure Certified'],
                shiftInfo: {
                    shiftType: 'day',
                    shiftStartTime: '08:00',
                    shiftEndTime: '17:00',
                    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    location: 'IT Department - Building A',
                    effectiveDate: new Date('2023-01-01')
                },
                emergencyContact: {
                    name: 'Admin Emergency Contact',
                    relationship: 'Spouse',
                    phone: '+1 (555) 001-0002'
                }
            },
            {
                name: 'John Anderson',
                email: 'john.anderson@company.com',
                password: 'manager123',
                phone: '+1 (555) 123-4567',
                department: 'Maintenance Engineering',
                role: 'Department Manager',
                status: 'active',
                avatar: '/placeholder-user.jpg',
                employeeId: 'EMP-MAINT-001',
                joinDate: new Date('2022-03-15'),
                supervisor: 'EMP-ADMIN-001',
                accessLevel: 'department_admin',
                skills: ['Mechanical Engineering', 'Team Management', 'Preventive Maintenance'],
                certifications: ['Professional Engineer (PE)', 'Maintenance Management Certificate'],
                shiftInfo: {
                    shiftType: 'day',
                    shiftStartTime: '07:00',
                    shiftEndTime: '16:00',
                    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    location: 'Maintenance Workshop - Building B',
                    effectiveDate: new Date('2022-03-15')
                },
                emergencyContact: {
                    name: 'Jane Anderson',
                    relationship: 'Spouse',
                    phone: '+1 (555) 123-4568'
                }
            },
            {
                name: 'Mike Johnson',
                email: 'mike.johnson@company.com',
                password: 'technician123',
                phone: '+1 (555) 789-0123',
                department: 'Maintenance Engineering',
                role: 'Senior Technician',
                status: 'active',
                avatar: '/placeholder-user.jpg',
                employeeId: 'EMP-MAINT-002',
                joinDate: new Date('2022-08-20'),
                supervisor: 'EMP-MAINT-001',
                accessLevel: 'normal_user',
                skills: ['Electrical Systems', 'Hydraulics', 'Troubleshooting'],
                certifications: ['Electrical Safety Certification', 'OSHA 30-Hour'],
                shiftInfo: {
                    shiftType: 'rotating',
                    shiftStartTime: '08:00',
                    shiftEndTime: '16:00',
                    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    location: 'Production Floor - Building C',
                    effectiveDate: new Date('2022-08-20')
                },
                emergencyContact: {
                    name: 'Sarah Johnson',
                    relationship: 'Sister',
                    phone: '+1 (555) 789-0124'
                }
            }
        ];
        console.log('Creating test users...');
        const createdUsers = await Employee_1.default.insertMany(testUsers);
        console.log('Test users created successfully:');
        createdUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - Access Level: ${user.accessLevel}`);
        });
        console.log('\nDatabase seeded with test users successfully!');
    }
    catch (error) {
        console.error('Error creating test users:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Database connection closed');
    }
}
createTestUsers();
