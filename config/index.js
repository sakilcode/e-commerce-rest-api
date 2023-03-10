import dotenv from 'dotenv';
dotenv.config();

export const {
    APP_HOST,
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET
} = process.env;