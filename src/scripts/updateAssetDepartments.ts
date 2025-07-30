import mongoose from 'mongoose';
import Asset from '../models/Asset';
import Department from '../models/Department';
import Database from '../config/database';

const updateAssetDepartments = async () => {
  try {
    console.log('🔄 Connecting to database...');
    const db = Database.getInstance();
    await db.connect();

    // Get all departments
    const departments = await Department.find({});
    console.log(`📊 Found ${departments.length} departments`);

    if (departments.length === 0) {
      console.log('❌ No departments found. Please seed departments first.');
      process.exit(1);
    }

    // Get all assets without department
    const assetsWithoutDepartment = await Asset.find({
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

    // Assign departments to assets based on category or randomly
    const departmentMapping: { [key: string]: string } = {
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
      
      // If no mapping found, assign to the first available department
      if (!assignedDepartment) {
        const availableDept = departments.find(d => d.name === 'Maintenance') || departments[0];
        if (availableDept) {
          assignedDepartment = availableDept.name;
        } else {
          console.log(`❌ No departments available for ${asset.assetName}`);
          continue;
        }
      }

      // Find the department in our list to ensure it exists
      const dept = departments.find(d => d.name === assignedDepartment);
      if (dept) {
        await Asset.findByIdAndUpdate(asset._id, {
          department: dept.name
        });
        updateCount++;
        console.log(`✅ Updated ${asset.assetName} (${asset.category}) → ${dept.name}`);
      } else {
        console.log(`❌ Department '${assignedDepartment}' not found for ${asset.assetName}`);
        // Assign to first available department as fallback
        if (departments.length > 0 && departments[0]) {
          await Asset.findByIdAndUpdate(asset._id, {
            department: departments[0].name
          });
          updateCount++;
          console.log(`✅ Updated ${asset.assetName} (fallback) → ${departments[0].name}`);
        }
      }
    }

    console.log(`🎉 Successfully updated ${updateCount} assets with departments`);

    // Show summary
    const summary = await Asset.aggregate([
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
  } catch (error) {
    console.error('❌ Error updating asset departments:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  updateAssetDepartments();
}

export default updateAssetDepartments;