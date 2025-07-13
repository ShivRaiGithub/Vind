import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'vind';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

let cachedConnection: MongoConnection | null = null;

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const client = new MongoClient(MONGODB_URI!);
    await client.connect();
    
    const db = client.db(MONGODB_DB);
    
    cachedConnection = { client, db };
    
    console.log('Connected to MongoDB');
    return cachedConnection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getUsersCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('users');
}

export async function getVideosCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('videos');
}

export async function getCommentsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('comments');
}

export async function getUserByEmail(email: string) {
  try {
    const { db } = await connectToDatabase();
    const users = db.collection('users');
    return await users.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const { db } = await connectToDatabase();
    const users = db.collection('users');
    return await users.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function createUser(userData: any) {
  try {
    const { db } = await connectToDatabase();
    const users = db.collection('users');
    const result = await users.insertOne({
      ...userData,
      createdAt: new Date().toISOString(),
      online: true,
      followers: 0,
      following: 0,
      likesReceived: 0,
      videosCount: 0,
      verified: false,
    });
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserStatus(userId: string, online: boolean) {
  try {
    const { db } = await connectToDatabase();
    const users = db.collection('users');
    return await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { online, lastSeen: new Date().toISOString() } }
    );
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}
