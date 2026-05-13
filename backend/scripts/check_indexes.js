const mongoose = require('mongoose');
require('dotenv').config();

const Inventory = require('../models/Inventory');

async function checkIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(' MongoDB Connected\n');

    const indexes = await Inventory.collection.indexes();

    indexes.forEach((index, i) => {
      console.log(`\n#${i + 1}`);
      console.log('Name:', index.name);
      console.log('Key:', index.key);
      console.log('Unique:', index.unique || false);
    });

    console.log('\n Total Indexes:', indexes.length);

    process.exit(0);
  } catch (err) {
    console.error(' Failed:', err);
    process.exit(1);
  }
}

checkIndexes();