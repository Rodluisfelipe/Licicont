import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log(`[DB] MongoDB connected → ${env.MONGODB_URI.split('@').pop() || 'localhost'}`);
  } catch (error) {
    console.error('[DB] Connection failed:', error);
    process.exit(1);
  }
}
