const express = require('express');
const passport = require('../strategies/google.strategy');
const googleAuthController = require('../controllers/google-auth.controller');

const router = express.Router();

// Check if Google OAuth is enabled
const isGoogleOAuthEnabled =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

// Middleware to check if Google OAuth is enabled
const checkGoogleOAuthEnabled = (req, res, next) => {
  if (!isGoogleOAuthEnabled) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured on this server',
      error: 'Service Unavailable',
    });
  }
  next();
};

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get(
  '/',
  checkGoogleOAuthEnabled,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get(
  '/callback',
  checkGoogleOAuthEnabled,
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/failure',
  }),
  googleAuthController.googleCallback
);

/**
 * @route   GET /api/auth/google/failure
 * @desc    Handle Google OAuth failure
 * @access  Public
 */
router.get('/failure', googleAuthController.googleFailure);

module.exports = router;
