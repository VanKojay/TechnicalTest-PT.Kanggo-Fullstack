require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Kanggo Task Manager API Docs',
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Kanggo Task Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('✅ Database synced successfully');
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
      });
    })
    .catch((err) => {
      console.error('❌ Database sync failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
