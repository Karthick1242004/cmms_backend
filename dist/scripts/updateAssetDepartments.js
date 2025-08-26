"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Asset_1 = __importDefault(require("../models/Asset"));
const Department_1 = __importDefault(require("../models/Department"));
const database_1 = __importDefault(require("../config/database"));
const updateAssetDepartments = async () => {
    try {
        console.log('🔄 Connecting to database...');
        const db = database_1.default.getInstance();
        await db.connect();
        const departments = await Department_1.default.find({});
        console.log(`📊 Found ${departments.length} departments`);
        if (departments.length === 0) {
            console.log('❌ No departments found. Please seed departments first.');
            process.exit(1);
        }
        const assetsWithoutDepartment = await Asset_1.default.find({
            $or: [
                { department: { $exists: false } },
                { department: null },
                { department: '' }
            ]
        });
        console.log(`🔧 Found ${assetsWithoutDepartment.length} assets without department`);
        if (assetsWithoutDepartment.length === 0) {
            console.log('✅ All assets already have departments assigned');
            process.exit(0);
        }
        const departmentMapping = {
            'Equipment': 'Maintenance',
            'Facilities': 'Facilities Management',
            'Products': 'Production',
            'Tools': 'Maintenance',
            'IT Equipment': 'IT',
            'Vehicles': 'Fleet Management',
            'Safety Equipment': 'Safety'
        };
        let updateCount = 0;
        for (const asset of assetsWithoutDepartment) {
            let assignedDepartment = departmentMapping[asset.category];
            if (!assignedDepartment) {
                const availableDept = departments.find((d) => d.name === 'Maintenance') || departments[0];
                if (availableDept) {
                    assignedDepartment = availableDept.name;
                }
                else {
                    console.log(`❌ No departments available for ${asset.assetName}`);
                    continue;
                }
            }
            const dept = departments.find((d) => d.name === assignedDepartment);
            if (dept) {
                await Asset_1.default.findByIdAndUpdate(asset._id, {
                    department: dept.name
                });
                updateCount++;
                console.log(`✅ Updated ${asset.assetName} (${asset.category}) → ${dept.name}`);
            }
            else {
                console.log(`❌ Department '${assignedDepartment}' not found for ${asset.assetName}`);
                if (departments.length > 0 && departments[0]) {
                    await Asset_1.default.findByIdAndUpdate(asset._id, {
                        department: departments[0].name
                    });
                    updateCount++;
                    console.log(`✅ Updated ${asset.assetName} (fallback) → ${departments[0].name}`);
                }
            }
        }
        console.log(`🎉 Successfully updated ${updateCount} assets with departments`);
        const summary = await Asset_1.default.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        console.log('\n📊 Assets by Department:');
        summary.forEach(item => {
            console.log(`  ${item._id}: ${item.count} assets`);
        });
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error updating asset departments:', error);
        process.exit(1);
    }
};
if (require.main === module) {
    updateAssetDepartments();
}
exports.default = updateAssetDepartments;
