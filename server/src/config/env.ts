import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/licicont',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GMAIL_USER: process.env.GMAIL_USER || '',
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
