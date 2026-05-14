const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id", "x-tenant-slug"],
    exposedHeaders: ["x-tenant-id", "x-tenant-slug"],
  })
);
app.use(express.json());
const tenantHandler = require("./middleware/tenantHandler");
app.use(tenantHandler);

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "easy-colonizer-local-dev-secret";
  console.warn("JWT_SECRET missing. Using local development fallback.");
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const propertyRoutes = require('./routes/propertyRoutes');
const leadRoutes = require('./routes/leadRoutes');
const authRoutes = require('./routes/authRoutes');
const syncRoutes = require('./routes/syncRoutes');
const siteVisitRoutes = require('./routes/siteVisitRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const userRoutes = require('./routes/userRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/site-visits', siteVisitRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tenants', tenantRoutes);

app.get('/', (req, res) => {
  res.send('Easy Colonizer API is running...');
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Easy Colonizer API is healthy',
    mongo:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

app.use((err, req, res, next) => {
  console.error("API ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Export the app for Vercel serverless functions
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
