import express from 'express';
import { 
  getThemePreference, 
  updateThemePreference, 
  getProfileImage, 
  updateProfileImage 
} from '../controllers/userController.js';

const router = express.Router();

// Theme preferences routes
router.route('/preferences/theme')
  .get(getThemePreference)
  .put(updateThemePreference);

// Profile image routes
router.route('/profile-image')
  .get(getProfileImage)
  .put(updateProfileImage);

export default router;
