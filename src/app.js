const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const passport = require('passport');

const { errorHandler, notFoundHandler } = require('@middlewares/error.middleware');
const morganMiddleware = require('@middlewares/logger.middleware');
const { apiLimiter } = require('@middlewares/rate-limit.middleware');
const routes = require('./routes');

// Initialize Passport strategies
require('@modules/auth/strategies/google.strategy');

const app = express();

// Trust proxy - Required for Render.com and other reverse proxies
app.set('trust proxy', 1);

// Security middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://lct-locket-web-app.onrender.com',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Check if origin ends with .figma.site
    if (origin.endsWith('.figma.site')) {
      return callback(null, true);
    }

    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  exposedHeaders: ['x-access-token', 'x-refresh-token'],
};

app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

// Compression
app.use(compression());

// Logging
app.use(morganMiddleware);

// Rate limiting
app.use('/api/', apiLimiter);

// Static files with CORS headers
app.use(
  '/uploads',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  },
  express.static('uploads')
);

app.use('/public', express.static('public'));

// Root health check
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'LCT Node.js Core API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Documentation
app.get('/docs', (_req, res) => {
  res.sendFile('api-docs.html', { root: 'public' });
});
app.get('/api-docs', (_req, res) => {
  res.sendFile('api-docs.html', { root: 'public' });
});

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
