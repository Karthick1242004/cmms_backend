"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleAssets = void 0;
exports.populateAssets = populateAssets;
const Asset_1 = __importDefault(require("../models/Asset"));
const database_1 = __importDefault(require("../config/database"));
// Sample asset data (matching the frontend data structure)
const sampleAssets = [
    // Equipment Example - Maintenance Department
    {
        assetName: "The Cat® 416F2 Backhoe Loader",
        serialNo: "A6381949",
        rfid: "4036BA6629E8716D0BB81079",
        parentAsset: "-",
        productName: "PC00010 - Backhoe Loader",
        categoryName: "Equipment > Heavy Machinery",
        statusText: "Online",
        statusColor: "green",
        assetClass: "Operating Assets",
        constructionYear: 2022,
        warrantyStart: "07-Sep-2022",
        manufacturer: "Caterpillar Inc.",
        outOfOrder: "No",
        isActive: "Yes",
        category: "Equipment",
        department: "Maintenance",
        size: "Large",
        costPrice: 75000.0,
        productionHoursDaily: 0.0,
        serviceStatus: "Operational",
        description: "Heavy-duty backhoe loader for construction and excavation tasks.",
        lastEnquiryDate: "15-May-2025",
        productionTime: "8 hours/day",
        lineNumber: "Production Line A",
        assetType: "Tangible",
        commissioningDate: "07-Sep-2022",
        endOfWarranty: "07-Sep-2023",
        expectedLifeSpan: 10,
        deleted: "No",
        allocated: "Tracy Desmond (kate09mark@gmail.com)",
        allocatedOn: "10-Sep-2022",
        uom: "Each",
        salesPrice: 0.0,
        lastEnquiryBy: "John Smith",
        shelfLifeInMonth: 0,
        location: "Main Yard",
        purchaseDate: "01-Sep-2022",
        purchasePrice: 75000,
        condition: "good",
        imageSrc: "/placeholder.svg?height=150&width=250",
        partsBOM: [
            {
                id: "BOM001",
                partName: "Hydraulic Fluid",
                partNumber: "HF-CAT-001",
                quantity: 50,
                unitCost: 25.50,
                supplier: "Caterpillar Parts",
                lastReplaced: "15-Mar-2025"
            },
            {
                id: "BOM002",
                partName: "Air Filter",
                partNumber: "AF-CAT-416F2",
                quantity: 2,
                unitCost: 45.00,
                supplier: "Caterpillar Parts",
                lastReplaced: "10-Jan-2025"
            },
            {
                id: "BOM003",
                partName: "Engine Oil",
                partNumber: "EO-15W40",
                quantity: 20,
                unitCost: 12.75,
                supplier: "Mobil 1",
                lastReplaced: "01-Feb-2025"
            }
        ],
        meteringEvents: [
            {
                id: "ME001",
                eventType: "Hours Meter Reading",
                reading: 1247.5,
                unit: "hours",
                recordedDate: "20-May-2025",
                recordedBy: "John Smith"
            },
            {
                id: "ME002",
                eventType: "Fuel Consumption",
                reading: 850.2,
                unit: "gallons",
                recordedDate: "18-May-2025",
                recordedBy: "Mike Wilson"
            }
        ],
        personnel: [
            {
                id: "PER001",
                name: "Tracy Desmond",
                role: "Primary Operator",
                email: "kate09mark@gmail.com",
                phone: "+1-555-0123",
                assignedDate: "10-Sep-2022"
            },
            {
                id: "PER002",
                name: "John Smith",
                role: "Maintenance Technician",
                email: "john.smith@company.com",
                phone: "+1-555-0456",
                assignedDate: "01-Sep-2022"
            }
        ],
        warrantyDetails: {
            provider: "Caterpillar Inc.",
            type: "Full Coverage",
            startDate: "07-Sep-2022",
            endDate: "07-Sep-2023",
            coverage: "Parts and Labor",
            terms: "Standard manufacturer warranty covering defects in materials and workmanship",
            contactInfo: "1-800-CATERPILLAR",
            claimHistory: []
        },
        businesses: [
            {
                id: "BUS001",
                name: "Main Construction Division",
                type: "Operating Unit",
                contactPerson: "Sarah Johnson",
                phone: "+1-555-0789"
            }
        ],
        files: [
            {
                id: "FILE001",
                name: "Operation Manual",
                type: "PDF",
                size: "2.5 MB",
                uploadDate: "07-Sep-2022",
                uploadedBy: "Admin User"
            },
            {
                id: "FILE002",
                name: "Maintenance Schedule",
                type: "PDF",
                size: "1.2 MB",
                uploadDate: "15-Sep-2022",
                uploadedBy: "John Smith"
            }
        ],
        financials: {
            totalCostOfOwnership: 92000.0,
            annualOperatingCost: 12000.0,
            depreciationRate: 0.10,
            currentBookValue: 67500.0,
            maintenanceCostYTD: 5200.0,
            fuelCostYTD: 8400.0
        },
        purchaseInfo: {
            purchaseOrderNumber: "PO-2022-001",
            vendor: "Caterpillar Dealer Network",
            purchaseDate: "01-Sep-2022",
            deliveryDate: "05-Sep-2022",
            terms: "Net 30",
            discount: 0.05,
            totalCost: 75000.0
        },
        associatedCustomer: {
            id: "CUST001",
            name: "Internal Operations",
            type: "Internal",
            contactPerson: "Operations Manager",
            phone: "+1-555-0999"
        },
        log: [
            {
                id: "LOG001",
                date: "20-May-2025",
                action: "Routine Inspection",
                performedBy: "John Smith",
                notes: "All systems operating normally"
            },
            {
                id: "LOG002",
                date: "15-Mar-2025",
                action: "Hydraulic Fluid Change",
                performedBy: "Mike Wilson",
                notes: "Replaced 50 gallons of hydraulic fluid"
            }
        ]
    },
    // Equipment Example - IT Department
    {
        assetName: "Dell PowerEdge R740 Server",
        serialNo: "IT001949",
        rfid: "4036IT6629E8716D0BB81079",
        parentAsset: "Server Rack A",
        productName: "R740-001 - PowerEdge Server",
        categoryName: "Equipment > IT Hardware",
        statusText: "Online",
        statusColor: "green",
        assetClass: "Operating Assets",
        constructionYear: 2023,
        warrantyStart: "15-Jan-2023",
        manufacturer: "Dell Technologies",
        outOfOrder: "No",
        isActive: "Yes",
        category: "Equipment",
        department: "IT",
        size: "Standard",
        costPrice: 8500.0,
        productionHoursDaily: 24.0,
        serviceStatus: "Operational",
        description: "High-performance server for enterprise applications and databases.",
        lastEnquiryDate: "20-May-2025",
        productionTime: "24/7 Operation",
        lineNumber: "Data Center Rack A",
        assetType: "Tangible",
        commissioningDate: "15-Jan-2023",
        endOfWarranty: "15-Jan-2026",
        expectedLifeSpan: 5,
        deleted: "No",
        allocated: "IT Operations Team",
        allocatedOn: "20-Jan-2023",
        uom: "Each",
        salesPrice: 0.0,
        lastEnquiryBy: "Sarah Johnson",
        shelfLifeInMonth: 0,
        location: "Data Center - Rack A",
        purchaseDate: "10-Jan-2023",
        purchasePrice: 8500,
        condition: "excellent",
        imageSrc: "/placeholder.svg?height=150&width=250",
        partsBOM: [
            {
                id: "BOM001",
                partName: "Memory Module 32GB",
                partNumber: "MEM-32GB-DDR4",
                quantity: 8,
                unitCost: 250.00,
                supplier: "Dell Technologies",
                lastReplaced: "N/A"
            },
            {
                id: "BOM002",
                partName: "SSD Drive 1TB",
                partNumber: "SSD-1TB-NVME",
                quantity: 4,
                unitCost: 180.00,
                supplier: "Dell Technologies",
                lastReplaced: "N/A"
            }
        ],
        meteringEvents: [
            {
                id: "ME001",
                eventType: "CPU Usage",
                reading: 45.2,
                unit: "percent",
                recordedDate: "20-May-2025",
                recordedBy: "Monitoring System"
            },
            {
                id: "ME002",
                eventType: "Memory Usage",
                reading: 78.5,
                unit: "percent",
                recordedDate: "20-May-2025",
                recordedBy: "Monitoring System"
            }
        ],
        personnel: [
            {
                id: "PER001",
                name: "Sarah Johnson",
                role: "System Administrator",
                email: "sarah.johnson@company.com",
                phone: "+1-555-0234",
                assignedDate: "20-Jan-2023"
            },
            {
                id: "PER002",
                name: "David Chen",
                role: "Network Engineer",
                email: "david.chen@company.com",
                phone: "+1-555-0567",
                assignedDate: "25-Jan-2023"
            }
        ],
        warrantyDetails: {
            provider: "Dell Technologies",
            type: "ProSupport Plus",
            startDate: "15-Jan-2023",
            endDate: "15-Jan-2026",
            coverage: "24/7 Support and Parts",
            terms: "Next business day on-site service",
            contactInfo: "1-800-DELL-SUPPORT",
            claimHistory: []
        },
        businesses: [
            {
                id: "BUS001",
                name: "IT Operations Division",
                type: "Support Unit",
                contactPerson: "IT Manager",
                phone: "+1-555-0890"
            }
        ],
        files: [
            {
                id: "FILE001",
                name: "Server Configuration Guide",
                type: "PDF",
                size: "1.8 MB",
                uploadDate: "15-Jan-2023",
                uploadedBy: "Sarah Johnson"
            },
            {
                id: "FILE002",
                name: "Network Diagram",
                type: "PDF",
                size: "0.9 MB",
                uploadDate: "20-Jan-2023",
                uploadedBy: "David Chen"
            }
        ],
        financials: {
            totalCostOfOwnership: 12000.0,
            annualOperatingCost: 2400.0,
            depreciationRate: 0.20,
            currentBookValue: 6800.0,
            maintenanceCostYTD: 450.0,
            fuelCostYTD: 0.0
        },
        purchaseInfo: {
            purchaseOrderNumber: "PO-2023-IT-001",
            vendor: "Dell Technologies",
            purchaseDate: "10-Jan-2023",
            deliveryDate: "12-Jan-2023",
            terms: "Net 30",
            discount: 0.10,
            totalCost: 8500.0
        },
        associatedCustomer: {
            id: "CUST001",
            name: "Internal IT Services",
            type: "Internal",
            contactPerson: "CTO",
            phone: "+1-555-0111"
        },
        log: [
            {
                id: "LOG001",
                date: "20-May-2025",
                action: "System Health Check",
                performedBy: "Sarah Johnson",
                notes: "All systems running optimally"
            },
            {
                id: "LOG002",
                date: "15-Apr-2025",
                action: "Security Update",
                performedBy: "David Chen",
                notes: "Applied latest security patches"
            }
        ]
    },
    // Add other assets here...
    // For brevity, I'll add just a few more key ones
    // Tools Example - IT Department
    {
        assetName: "Heavy Duty Wrench Set (Metric)",
        serialNo: "HDWS-M-001",
        rfid: "TOOL001WRENCHRFID",
        parentAsset: "Tool Inventory",
        productName: "Professional Wrench Set",
        categoryName: "Tools > Hand Tools",
        statusText: "Available",
        statusColor: "green",
        assetClass: "Portable Tools",
        constructionYear: 2022,
        warrantyStart: "15-Dec-2022",
        manufacturer: "Craftsman",
        outOfOrder: "No",
        isActive: "Yes",
        category: "Tools",
        department: "IT",
        size: "Standard",
        costPrice: 120.0,
        productionHoursDaily: 0.0,
        serviceStatus: "Available",
        description: "Complete set of metric heavy-duty wrenches for various tasks.",
        lastEnquiryDate: "17-May-2025",
        productionTime: "As needed",
        lineNumber: "Tool Crib A",
        assetType: "Reusable",
        commissioningDate: "01-Jan-2023",
        endOfWarranty: "15-Dec-2025",
        expectedLifeSpan: 5,
        deleted: "No",
        allocated: "Tool Crib A",
        allocatedOn: "01-Jan-2023",
        uom: "Set",
        salesPrice: 0.0,
        lastEnquiryBy: "IT Technician",
        shelfLifeInMonth: 0,
        location: "Tool Crib A",
        purchaseDate: "15-Dec-2022",
        purchasePrice: 120,
        condition: "good",
        imageSrc: "/placeholder.svg?height=150&width=250",
        partsBOM: [
            {
                id: "BOM001",
                partName: "8mm Wrench",
                partNumber: "WR-8MM-001",
                quantity: 1,
                unitCost: 8.00,
                supplier: "Craftsman",
                lastReplaced: "N/A"
            }
        ],
        meteringEvents: [
            {
                id: "ME001",
                eventType: "Usage Count",
                reading: 15.0,
                unit: "checkouts",
                recordedDate: "20-May-2025",
                recordedBy: "Tool Crib System"
            }
        ],
        personnel: [
            {
                id: "PER001",
                name: "Tool Crib Manager",
                role: "Inventory Manager",
                email: "toolcrib@company.com",
                phone: "+1-555-0678",
                assignedDate: "01-Jan-2023"
            }
        ],
        warrantyDetails: {
            provider: "Craftsman",
            type: "Limited Warranty",
            startDate: "15-Dec-2022",
            endDate: "15-Dec-2025",
            coverage: "Manufacturing Defects",
            terms: "Replace or repair defective tools",
            contactInfo: "1-800-CRAFTSMAN",
            claimHistory: []
        },
        businesses: [
            {
                id: "BUS001",
                name: "IT Support Services",
                type: "Support Unit",
                contactPerson: "IT Manager",
                phone: "+1-555-0234"
            }
        ],
        files: [
            {
                id: "FILE001",
                name: "Tool Specifications",
                type: "PDF",
                size: "1.2 MB",
                uploadDate: "15-Dec-2022",
                uploadedBy: "Tool Crib Manager"
            }
        ],
        financials: {
            totalCostOfOwnership: 120.0,
            annualOperatingCost: 0.0,
            depreciationRate: 0.20,
            currentBookValue: 72.0,
            maintenanceCostYTD: 0.0,
            fuelCostYTD: 0.0
        },
        purchaseInfo: {
            purchaseOrderNumber: "PO-2022-TOOL-001",
            vendor: "Craftsman",
            purchaseDate: "15-Dec-2022",
            deliveryDate: "20-Dec-2022",
            terms: "Net 30",
            discount: 0.15,
            totalCost: 120.0
        },
        associatedCustomer: {
            id: "CUST001",
            name: "IT Department",
            type: "Internal",
            contactPerson: "IT Manager",
            phone: "+1-555-0234"
        },
        log: [
            {
                id: "LOG001",
                date: "20-May-2025",
                action: "Checked Out",
                performedBy: "IT Technician",
                notes: "Checked out for server maintenance"
            }
        ]
    }
];
exports.sampleAssets = sampleAssets;
async function populateAssets() {
    try {
        // Connect to database
        const database = database_1.default.getInstance();
        await database.connect();
        console.log('✅ Connected to database');
        // Clear existing assets
        await Asset_1.default.deleteMany({});
        console.log('🗑️  Cleared existing assets');
        // Insert sample assets
        const result = await Asset_1.default.insertMany(sampleAssets);
        console.log(`✅ Successfully inserted ${result.length} assets`);
        // Show summary
        const stats = await Asset_1.default.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    departments: { $addToSet: '$department' }
                }
            }
        ]);
        console.log('\n📊 Asset Summary:');
        stats.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count} assets (${stat.departments.join(', ')})`);
        });
        console.log('\n🎉 Asset population completed successfully!');
    }
    catch (error) {
        console.error('❌ Error populating assets:', error);
    }
    finally {
        // Disconnect from database
        const database = database_1.default.getInstance();
        await database.disconnect();
        console.log('💾 Disconnected from database');
        process.exit(0);
    }
}
// Run the population script
if (require.main === module) {
    populateAssets();
}
//# sourceMappingURL=populateAssets.js.map