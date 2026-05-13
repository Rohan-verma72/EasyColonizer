const mongoose = require('mongoose');
require('dotenv').config();

const Inventory = require('../models/Inventory'); // adjust path

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(' Connected to MongoDB');

    const existingIndexes = await Inventory.collection.indexes();

    console.log('\n Existing Indexes:\n');

    existingIndexes.forEach((index) => {
      console.log(index.name);
    });

    const oldIndex =
      'propertyId_1_phase_1_block_1_floor_1_unitNumber_1';

    const oldSimpleIndex =
      'propertyId_1_block_1_unitNumber_1';

    try {
      await Inventory.collection.dropIndex(oldIndex);

      console.log(`\n Dropped old index: ${oldIndex}`);
    } catch (err) {
      console.log(`\n ${oldIndex} not found`);
    }

    try {
      await Inventory.collection.dropIndex(oldSimpleIndex);

      console.log(` Dropped old index: ${oldSimpleIndex}`);
    } catch (err) {
      console.log(` ${oldSimpleIndex} not found`);
    }

    await Inventory.collection.createIndex(
      {
        propertyId: 1,
        phase: 1,
        block: 1,
        unitNumber: 1,
      },
      {
        unique: true,
        name: 'inventory_unique_unit',
      }
    );

    console.log('\n New index created successfully');

    const finalIndexes = await Inventory.collection.indexes();

    console.log('\n Final Indexes:\n');

    console.log(JSON.stringify(finalIndexes, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('\n Index Fix Error:\n', err);

    process.exit(1);
  }
}

fixIndexes();