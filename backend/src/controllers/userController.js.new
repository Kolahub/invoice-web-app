import User from '../models/User.js';

// Get user theme preference
export const getThemePreference = async (req, res, next) => {
  try {
    // In a real app, you would get the user ID from the auth token
    // For now, we'll use a default user ID
    const userId = 'default-user-id';
    
    // Find or create user with default theme preference
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = await User.create({
        userId,
        preferences: { theme: 'light' } // Default theme
      });
    }
    
    res.status(200).json({
      success: true,
      theme: user.preferences?.theme || 'light'
    });
  } catch (error) {
    next(error);
  }
};

// Update user theme preference
export const updateThemePreference = async (req, res, next) => {
  try {
    const { theme } = req.body;
    const userId = 'default-user-id'; // In a real app, get from auth token
    
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Theme must be either "light" or "dark"'
      });
    }
    
    // Find user or create if doesn't exist
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = await User.create({
        userId,
        preferences: { theme }
      });
    } else {
      user.preferences = user.preferences || {};
      user.preferences.theme = theme;
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      theme
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile image
export const getProfileImage = async (req, res, next) => {
  try {
    const userId = 'default-user-id';
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      profileImage: user.preferences?.profileImage || ''
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile image
export const updateProfileImage = async (req, res, next) => {
  try {
    const { imageData } = req.body;
    const userId = 'default-user-id';
    
    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required'
      });
    }
    
    // Find user or create if doesn't exist
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = await User.create({
        userId,
        preferences: { profileImage: imageData }
      });
    } else {
      user.preferences = user.preferences || {};
      user.preferences.profileImage = imageData;
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      profileImage: imageData
    });
  } catch (error) {
    next(error);
  }
};
