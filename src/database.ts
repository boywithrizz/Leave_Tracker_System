import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db;

export const initializeDatabase = async () => {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI!, {
      tlsAllowInvalidCertificates: true, // Disable SSL validation (for testing purposes)
    });

    await client.connect();
    db = client.db('attendance_db'); // Replace with your database name

    await db.collection('attendance').createIndex({ user_id: 1, date: 1 }, { unique: true });
  }

  return db;
};