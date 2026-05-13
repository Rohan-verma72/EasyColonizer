const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Property = require('../models/Property');
const User = require('../models/User');

require('dotenv').config();

const properties = [
  {
    title: "Bhopal Smart City Plots",
    description:
      "Premium residential plots near Kolar Road with high growth potential.",
    type: "Plot",
    price: 3500000,
    location: "Kolar Road, Bhopal",
    area: 1200,
    status: "Available",
    features: [
      "Corner Plot",
      "Main Road Facing",
      "Bhopal Smart City Vicinity",
    ],
    amenities: {
      parking: true,
      security: true,
      gym: false,
      pool: false,
      park: true,
    },
    project: "Saffron Park",
    reraId: "P-BPL-22-1234",
    possessionStatus: "Immediate Possession",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
    ],
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    floorPlans: [
      {
        title: "Master Layout",
      },
    ],
    brochureUrl: "#",
  },

  {
    title: "Arera Heights - Luxury 3BHK",
    description:
      "Ultra-luxury apartments in the most prestigious locality of Bhopal.",
    type: "Flat",
    price: 9500000,
    location: "Arera Colony, Bhopal",
    area: 2100,
    status: "Available",
    features: ["Italian Marble", "Automation", "Panoramic View"],
    amenities: {
      gym: true,
      pool: true,
      parking: true,
      security: true,
      park: false,
    },
    project: "Arera Heights",
    reraId: "P-BPL-23-5678",
    possessionStatus: "Ready to Move",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    ],
  },

  {
    title: "Lakeview Luxury Villa",
    description:
      "Exclusive lake-facing villa near Upper Lake, Bhopal.",
    type: "Villa",
    price: 25000000,
    location: "Shamla Hills, Bhopal",
    area: 4500,
    status: "Available",
    features: ["Lake Facing", "Private Lift", "Terrace Garden"],
    amenities: {
      gym: true,
      pool: true,
      parking: true,
      security: true,
      park: true,
    },
    project: "Lakeview Enclave",
    reraId: "P-BPL-24-9012",
    possessionStatus: "Under Construction",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1000",
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    await Property.syncIndexes();
    await User.syncIndexes();

    console.log(' Indexes synced');

    await Property.deleteMany({
      project: {
        $in: [
          'Saffron Park',
          'Arera Heights',
          'Lakeview Enclave',
        ],
      },
    });

    console.log(' Old demo properties removed');

    await Property.insertMany(properties);

    console.log(` ${properties.length} properties inserted`);

    const existingAdmin = await User.findOne({
      username: 'Rohan',
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@123',
        10
      );

      const admin = new User({
        username: 'Rohan',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'admin',
        active: true,
      });

      await admin.save();

      console.log('✅ Admin user created');
      console.log('Username: Rohan');
      console.log(
        `Password: ${
          process.env.ADMIN_PASSWORD || 'Admin@123'
        }`
      );
    } else {
      console.log('ℹ️ Admin already exists');
    }

    console.log('\n🚀 Database seeded successfully');

    await mongoose.disconnect();

    console.log(' MongoDB disconnected');

    process.exit(0);
  } catch (err) {
    console.error('\n Seeder Error:\n', err);

    await mongoose.disconnect();

    process.exit(1);
  }
}

seedDatabase();