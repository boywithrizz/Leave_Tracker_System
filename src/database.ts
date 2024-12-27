import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

let db: Db;

// Function to initialize the database connection
export const initializeDatabase = async () => {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI!, {
      tlsAllowInvalidCertificates: true, // Disable SSL validation (for testing purposes)
    });

    await client.connect();
    db = client.db('attendance_db'); // Replace with your database name

    try {
      await db.collection('attendance').createIndex({ user_id: 1, date: 1 }, { unique: true });
      await db.collection('users').createIndex({ user_id: 1 }, { unique: true });
      await db.collection('schedule').createIndex({ user_id: 1 }, { unique: true });
    } catch (error: any) {
      if (error.code !== 11000) { // Ignore duplicate key error
        console.error('Error creating indexes:', error);
      }
    }
  }

  return db;
};