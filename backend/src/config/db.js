import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

export const connectDB = async () => {
  try {
    // Use local MongoDB URI for development if not in production
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-app';
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Retry the connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

export const checkObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: 'Invalid ID format' 
    });
  }
  next();
};
