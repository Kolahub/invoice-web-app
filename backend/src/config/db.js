import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

// Cache the connection to avoid multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    // Use existing database connection
    return cached.conn;
  }

  if (!cached.promise) {
    // Create a new connection
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-app';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 minutes
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    try {
      cached.promise = mongoose.connect(mongoUri, options).then((mongoose) => {
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      // Clear the promise on error to allow retries
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Clear the promise on error to allow retries
    cached.promise = null;
    throw error;
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
