import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    profileImage: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
