import { MongoClient, Db } from 'mongodb';

let db: Db;

export const initializeDatabase = async () => {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI!);

    await client.connect();
    db = client.db('attendance_db'); // Replace with your database name

    await db.collection('attendance').createIndex({ user_id: 1, date: 1 }, { unique: true });
  }

  return db;
};