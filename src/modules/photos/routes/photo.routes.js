const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const reactionController = require('../controllers/reaction.controller');
const photoViewController = require('../controllers/photo-view.controller');
const debugController = require('../controllers/debug.controller');
const { authenticate } = require('@middlewares/authenticate.middleware');
const upload = require('../middlewares/photo-upload.middleware');
const {
  validateUploadPhoto,
  validateGetPhotosQuery,
  validatePhotoId,
  validateAddReaction,
  validateGetReactionsQuery,
  validateGetViewersQuery,
} = require('../validators/photo.validator');

/**
 * Photo Routes
 * All routes require authentication
 */

// Debug route (only in development)
if (process.env.NODE_ENV !== 'production') {
  router.get('/debug/feed', authenticate, debugController.debugFeed);
}

// Photo management routes
router.post('/', authenticate, upload.single('photo'), validateUploadPhoto, photoController.upload);

router.get('/feed', authenticate, validateGetPhotosQuery, photoController.getFeed);

router.get('/my', authenticate, validateGetPhotosQuery, photoController.getMyPhotos);

router.get('/:photoId', authenticate, validatePhotoId, photoController.getById);

router.delete('/:photoId', authenticate, validatePhotoId, photoController.delete);

// Reaction routes
router.post(
  '/:photoId/reactions',
  authenticate,
  validatePhotoId,
  validateAddReaction,
  reactionController.addReaction
);

router.delete(
  '/:photoId/reactions',
  authenticate,
  validatePhotoId,
  reactionController.removeReaction
);

router.get(
  '/:photoId/reactions',
  authenticate,
  validatePhotoId,
  validateGetReactionsQuery,
  reactionController.getReactions
);

// View tracking routes
router.post(
  '/:photoId/views',
  authenticate,
  validatePhotoId,
  photoViewController.recordView
);

router.get(
  '/:photoId/views',
  authenticate,
  validatePhotoId,
  validateGetViewersQuery,
  photoViewController.getViewers
);

module.exports = router;
