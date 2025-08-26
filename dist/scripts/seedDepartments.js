"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const Department_1 = __importDefault(require("../models/Department"));
const sampleDepartments = [
    {
        name: "Maintenance Engineering",
        description: "Responsible for preventive and corrective maintenance of all equipment and facilities. Ensures optimal operation and longevity of assets.",
        manager: "John Anderson",
        employeeCount: 15,
        status: "active"
    },
    {
        name: "Operations & Production",
        description: "Manages daily production operations, workflow optimization, and ensures production targets are met efficiently.",
        manager: "Sarah Mitchell",
        employeeCount: 28,
        status: "active"
    },
    {
        name: "Quality Assurance",
        description: "Ensures all products and processes meet quality standards through rigorous testing and compliance monitoring.",
        manager: "Robert Chen",
        employeeCount: 12,
        status: "active"
    },
    {
        name: "Supply Chain & Logistics",
        description: "Manages inventory, procurement, warehousing, and distribution of materials and finished products.",
        manager: "Maria Rodriguez",
        employeeCount: 20,
        status: "active"
    },
    {
        name: "Health & Safety",
        description: "Oversees workplace safety protocols, conducts safety training, and ensures compliance with safety regulations.",
        manager: "David Wilson",
        employeeCount: 8,
        status: "active"
    },
    {
        name: "IT Support & Systems",
        description: "Provides technical support, maintains IT infrastructure, and manages software systems across the organization.",
        manager: "Emily Zhang",
        employeeCount: 10,
        status: "active"
    },
    {
        name: "Human Resources",
        description: "Manages employee relations, recruitment, training programs, and organizational development initiatives.",
        manager: "Michael Brown",
        employeeCount: 6,
        status: "active"
    },
    {
        name: "Finance & Accounting",
        description: "Handles financial planning, budgeting, accounting operations, and financial reporting for the organization.",
        manager: "Lisa Thompson",
        employeeCount: 9,
        status: "active"
    },
    {
        name: "Research & Development",
        description: "Focuses on innovation, product development, and process improvement initiatives for competitive advantage.",
        manager: "Dr. James Kumar",
        employeeCount: 14,
        status: "active"
    },
    {
        name: "Environmental Compliance",
        description: "Ensures environmental regulations compliance, waste management, and sustainability initiatives implementation.",
        manager: "Amanda Green",
        employeeCount: 5,
        status: "inactive"
    }
];
async function seedDepartments() {
    try {
        const database = database_1.default.getInstance();
        await database.connect();
        console.log('🧹 Clearing existing departments...');
        await Department_1.default.deleteMany({});
        console.log('🌱 Seeding departments...');
        const insertedDepartments = await Department_1.default.insertMany(sampleDepartments);
        console.log(`✅ Successfully seeded ${insertedDepartments.length} departments:`);
        insertedDepartments.forEach((dept, index) => {
            console.log(`   ${index + 1}. ${dept.name} (Manager: ${dept.manager})`);
        });
        const connectionInfo = await database.getConnectionInfo();
        console.log('\n📊 Database Information:');
        console.log(`   Database: ${connectionInfo.name}`);
        console.log(`   Collections: ${connectionInfo.collections?.map((c) => c.name).join(', ')}`);
        const stats = await Department_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalDepartments: { $sum: 1 },
                    activeDepartments: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    inactiveDepartments: {
                        $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                    },
                    totalEmployees: { $sum: '$employeeCount' },
                    averageEmployeeCount: { $avg: '$employeeCount' }
                }
            }
        ]);
        if (stats.length > 0) {
            console.log('\n📈 Department Statistics:');
            console.log(`   Total Departments: ${stats[0].totalDepartments}`);
            console.log(`   Active Departments: ${stats[0].activeDepartments}`);
            console.log(`   Inactive Departments: ${stats[0].inactiveDepartments}`);
            console.log(`   Total Employees: ${stats[0].totalEmployees}`);
            console.log(`   Average Employees per Department: ${Math.round(stats[0].averageEmployeeCount)}`);
        }
        await database.disconnect();
        console.log('\n🎉 Seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding departments:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    seedDepartments();
}
exports.default = seedDepartments;
