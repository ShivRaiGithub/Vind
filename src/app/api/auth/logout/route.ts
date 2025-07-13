import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUsersCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Update user's online status
      const users = await getUsersCollection();
      await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { 
          $set: { 
            isOnline: false,
            lastSeen: new Date()
          } 
        }
      );
      
      return NextResponse.json({
        message: 'Logged out successfully'
      });
      
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
