import dotenv from 'dotenv';

dotenv.config();

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const FRONTEND_URI = process.env.FRONTEND_URI;
export const PORT = process.env.PORT || 8888;
export const MONGO_URI = process.env.MONGO_URI;
