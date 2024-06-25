import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
    console.log('Connecting to database...');
    console.log('Host: ' + process.env.DB_HOST);
    console.log('User: '+ process.env.DB_USER);
    console.log('Password: '+ process.env.DB_PASSWORD);
    console.log('Database: '+ process.env.DB_NAME);
  try {
    await pool.getConnection();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
