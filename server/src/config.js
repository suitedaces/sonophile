import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URI = isProduction ? 'https://sonophile.xyz/callback' : (process.env.REDIRECT_URI || 'http://localhost:8888/callback');
export const FRONTEND_URI = isProduction ? 'https://sonophile.xyz' : (process.env.FRONTEND_URI || 'http://localhost:5173');
export const PORT = process.env.PORT || 8888;
export const MONGO_URI = process.env.MONGO_URI;
