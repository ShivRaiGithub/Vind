import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getUsersCollection, getVideosCollection } from '@/lib/mongodb';

const seedUsers = [
  {
    username: 'creative_user',
    displayName: 'Creative User',
    email: 'creative@example.com',
    bio: 'Artist & Creator 🎨 | Sharing my journey through visual storytelling | DM for collaborations ✨',
    profilePicture: null,
    verified: true,
    followers: ['user2', 'user3', 'user4'],
    following: ['artist_daily', 'foodie_explorer'],
    likedVideos: [],
    createdAt: new Date('2023-03-15'),
    lastActive: new Date()
  },
  {
    username: 'funny_creator',
    displayName: 'Funny Creator',
    email: 'funny@example.com',
    bio: 'Making people laugh one video at a time 😂 | Comedy content creator',
    profilePicture: null,
    verified: true,
    followers: ['user1', 'user3'],
    following: ['creative_user'],
    likedVideos: [],
    createdAt: new Date('2023-05-20'),
    lastActive: new Date()
  },
  {
    username: 'artist_daily',
    displayName: 'Daily Artist',
    email: 'artist@example.com',
    bio: 'Daily art content ✨ | Time-lapse videos | Art tutorials',
    profilePicture: null,
    verified: true,
    followers: ['creative_user', 'user2'],
    following: ['creative_user', 'funny_creator'],
    likedVideos: [],
    createdAt: new Date('2023-04-10'),
    lastActive: new Date()
  },
  {
    username: 'foodie_explorer',
    displayName: 'Foodie Explorer',
    email: 'foodie@example.com',
    bio: 'Food adventures around the world 🍜 | Restaurant reviews | Cooking tips',
    profilePicture: null,
    verified: false,
    followers: ['user1'],
    following: ['creative_user', 'artist_daily'],
    likedVideos: [],
    createdAt: new Date('2023-06-01'),
    lastActive: new Date()
  }
];

const seedVideos = [
  {
    username: 'creative_user',
    description: 'Check out this amazing view! 🌅 Perfect morning vibes with nature\'s beauty #nature #sunrise #peaceful',
    likes: 1234,
    comments: 89,
    shares: 45,
    views: 15600,
    playback_id: 'demo-1',
    thumbnail: null,
    created_at: new Date('2025-07-10T08:00:00Z'),
  },
  {
    username: 'creative_user',
    description: 'Quick art session in the park 🎨 Love creating outdoors! #art #nature #creative',
    likes: 892,
    comments: 67,
    shares: 32,
    views: 12300,
    playback_id: 'demo-2',
    thumbnail: null,
    created_at: new Date('2025-07-09T14:30:00Z'),
  },
  {
    username: 'creative_user',
    description: 'Sunset painting time-lapse ✨ Watch the magic happen! #art #painting #sunset',
    likes: 2341,
    comments: 234,
    shares: 89,
    views: 28900,
    playback_id: 'demo-3',
    thumbnail: null,
    created_at: new Date('2025-07-08T18:45:00Z'),
  },
  {
    username: 'funny_creator',
    description: 'When you realize it\'s Monday again 😅 We\'ve all been there! #mondayvibes #relatable #mood',
    likes: 1876,
    comments: 156,
    shares: 67,
    views: 22100,
    playback_id: 'demo-4',
    thumbnail: null,
    created_at: new Date('2025-07-10T12:30:00Z'),
  },
  {
    username: 'artist_daily',
    description: 'Character design process ⚡ From sketch to final! #characterdesign #art #process',
    likes: 3421,
    comments: 127,
    shares: 156,
    views: 41200,
    playback_id: 'demo-5',
    thumbnail: null,
    created_at: new Date('2025-07-10T15:45:00Z'),
  },
  {
    username: 'foodie_explorer',
    description: 'Best ramen in Tokyo! 🍜 This place is absolutely incredible - the broth is perfect! #food #ramen #tokyo',
    likes: 567,
    comments: 89,
    shares: 23,
    views: 8900,
    playback_id: 'demo-6',
    thumbnail: null,
    created_at: new Date('2025-07-10T18:20:00Z'),
  }
];

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    console.log('Starting database seeding...');
    const usersCollection = await getUsersCollection();
    const videosCollection = await getVideosCollection();

    // Clear existing data
    console.log('Clearing existing data...');
    await usersCollection.deleteMany({});
    await videosCollection.deleteMany({});

    // Insert users
    console.log('Seeding users...');
    await usersCollection.insertMany(seedUsers);

    // Insert videos
    console.log('Seeding videos...');
    await videosCollection.insertMany(seedVideos);

    console.log('Database seeded successfully!');
    
    return NextResponse.json({
      success: true,
      message: `Database seeded successfully! Added ${seedUsers.length} users and ${seedVideos.length} videos`,
      users: seedUsers.length,
      videos: seedVideos.length
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
