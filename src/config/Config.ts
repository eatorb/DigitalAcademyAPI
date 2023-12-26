import {Secret} from "jsonwebtoken";
import mysql, { Pool } from 'mysql';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables!');
}

if (!process.env.CAPTCHA_SECRET) {
    throw new Error('CAPTCHA_SECRET is not defined in environment variables!')
}

export const connection: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 1000
});
export const jwtSecret: Secret = process.env.JWT_SECRET;

export const captchaSecret: string = process.env.CAPTCHA_SECRET!;

export default {
    captchaSecret, connection, jwtSecret
}