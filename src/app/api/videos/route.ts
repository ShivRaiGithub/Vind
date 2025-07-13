import { NextRequest, NextResponse } from 'next/server';
import { getVideosCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sampleVideos } from '@/scripts/seedVideos';

// Initialize MongoDB with sample data if collection is empty
async function initializeVideos() {
  try {
    const videosCollection = await getVideosCollection();
    const count = await videosCollection.countDocuments();
    
    if (count === 0) {
      console.log('Initializing videos collection with sample data...');
      // Add demo videos and real seeded videos
      const demoVideos = [
        {
          id: '1',
          username: 'creative_user',
          description: 'Check out this amazing view! 🌅 Perfect morning vibes with nature\'s beauty #nature #sunrise #peaceful',
          likes: 1234,
          comments: 89,
          shares: 45,
          playback_id: 'demo-1',
          created_at: new Date('2025-07-10T08:00:00Z').toISOString(),
          user_avatar: null,
          verified: false,
        },
        {
          id: '2',
          username: 'funny_creator',
          description: 'When you realize it\'s Monday again 😅 We\'ve all been there! #mondayvibes #relatable #mood',
          likes: 892,
          comments: 156,
          shares: 23,
          playback_id: 'demo-2',
          created_at: new Date('2025-07-10T12:30:00Z').toISOString(),
          user_avatar: null,
          verified: true,
        },
        {
          id: '3',
          username: 'artist_daily',
          description: 'Quick sketch time-lapse ✨ Watch me bring this character to life in just 6 seconds! #art #drawing #creative',
          likes: 2341,
          comments: 234,
          shares: 89,
          playback_id: 'demo-3',
          created_at: new Date('2025-07-10T15:45:00Z').toISOString(),
          user_avatar: null,
          verified: true,
        },
        {
          id: '4',
          username: 'foodie_explorer',
          description: 'Best ramen in Tokyo! 🍜 This place is absolutely incredible - the broth is perfect! #food #ramen #tokyo',
          likes: 1876,
          comments: 127,
          shares: 67,
          playback_id: 'demo-4',
          created_at: new Date('2025-07-10T18:20:00Z').toISOString(),
          user_avatar: null,
          verified: false,
        },
        {
          id: '5',
          username: 'travel_addict',
          description: 'Hidden gem in Iceland 🏔️ This place doesn\'t even show up on maps! #travel #iceland #adventure',
          likes: 3421,
          comments: 298,
          shares: 156,
          playback_id: 'demo-5',
          created_at: new Date('2025-07-11T09:10:00Z').toISOString(),
          user_avatar: null,
          verified: true,
        }
      ];
      
      // Combine demo videos and real seeded videos
      const allVideos = [...demoVideos, ...sampleVideos];
      await videosCollection.insertMany(allVideos);
      console.log(`Initialized ${allVideos.length} videos in MongoDB`);
    }
  } catch (error) {
    console.error('Error initializing videos:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Initialize videos if needed
    await initializeVideos();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const videosCollection = await getVideosCollection();
    
    // Build query
    let query: any = {};
    if (search) {
      query = {
        $or: [
          { description: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const total = await videosCollection.countDocuments(query);

    // Get paginated results
    const videos = await videosCollection
      .find(query)
      .sort({ created_at: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Convert MongoDB _id to string id for frontend
    const formattedVideos = videos.map(video => ({
      ...video,
      id: video._id?.toString() || video.id,
      _id: undefined
    }));

    return NextResponse.json({
      videos: formattedVideos,
      total,
      page,
      limit,
      hasMore: (page * limit) < total,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, description, playback_id, asset_id } = await request.json();

    // Validate required fields
    if (!username || !description || !playback_id || !asset_id) {
      return NextResponse.json(
        { error: 'Missing required fields: username, description, playback_id, asset_id' },
        { status: 400 }
      );
    }

    const videosCollection = await getVideosCollection();

    const newVideo = {
      id: new ObjectId().toString(),
      username,
      description,
      likes: 0,
      comments: 0,
      shares: 0,
      playback_id,
      asset_id,
      created_at: new Date().toISOString(),
      user_avatar: null,
      verified: false,
    };

    const result = await videosCollection.insertOne(newVideo);

    // Return the created video with MongoDB _id as id
    const createdVideo = {
      ...newVideo,
      id: result.insertedId.toString(),
    };

    return NextResponse.json(createdVideo);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');
    const { action } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const videosCollection = await getVideosCollection();
    
    // Try to find by custom id first, then by MongoDB _id
    let query: any = { id: videoId };
    if (ObjectId.isValid(videoId)) {
      query = { $or: [{ id: videoId }, { _id: new ObjectId(videoId) }] };
    }

    const video = await videosCollection.findOne(query);

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    let updateOperation: any = {};

    switch (action) {
      case 'like':
        updateOperation = { $inc: { likes: 1 } };
        break;
      case 'unlike':
        updateOperation = { $inc: { likes: -1 } };
        break;
      case 'comment':
        updateOperation = { $inc: { comments: 1 } };
        break;
      case 'share':
        updateOperation = { $inc: { shares: 1 } };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await videosCollection.updateOne(query, updateOperation);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}
