import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsersCollection } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, displayName } = await request.json();

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Check if username contains only valid characters
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();
    
    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: 'This username is already taken' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const newUser = {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      displayName: displayName || username,
      password: hashedPassword,
      verified: false,
      followers: [], // Array of user IDs who follow this user
      following: [], // Array of user IDs this user follows
      likesReceived: 0,
      videosCount: 0,
      bio: '',
      profilePicture: null,
      isOnline: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // Insert user into database
    const result = await users.insertOne(newUser);
    
    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId.toString(), 
        email: newUser.email,
        username: newUser.username 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      token,
      user: {
        ...userWithoutPassword,
        id: result.insertedId.toString(),
      },
      message: 'Account created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
