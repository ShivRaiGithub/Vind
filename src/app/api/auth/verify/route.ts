import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserById } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await getUserById(decoded.userId);

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Remove sensitive information
      const { password, ...userWithoutPassword } = user;

      return NextResponse.json({ user: userWithoutPassword });
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
