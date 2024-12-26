import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri, {
  tlsAllowInvalidCertificates: true, // Disable SSL validation (for testing purposes)
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('attendance_db'); // Replace with your database name
    const collection = database.collection('test_collection');

    // Insert a test document
    const testDocument = { name: 'Test', value: 'This is a test document' };
    const insertResult = await collection.insertOne(testDocument);
    console.log('Inserted document:', insertResult.insertedId);

    // Retrieve the test document
    const retrievedDocument = await collection.findOne({ _id: insertResult.insertedId });
    console.log('Retrieved document:', retrievedDocument);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);