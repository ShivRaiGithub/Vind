import { NextRequest, NextResponse } from 'next/server';

// Mock database - in a real app, this would be a proper database
let videos: any[] = [
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let filteredVideos = videos;

    // Filter by search term
    if (search) {
      filteredVideos = videos.filter(video => 
        video.description.toLowerCase().includes(search.toLowerCase()) ||
        video.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    return NextResponse.json({
      videos: paginatedVideos,
      total: filteredVideos.length,
      page,
      limit,
      hasMore: endIndex < filteredVideos.length,
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

    const newVideo = {
      id: Date.now().toString(),
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

    videos.unshift(newVideo); // Add to beginning of array

    return NextResponse.json(newVideo);
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

    const videoIndex = videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const video = videos[videoIndex];

    switch (action) {
      case 'like':
        video.likes += 1;
        break;
      case 'unlike':
        video.likes = Math.max(0, video.likes - 1);
        break;
      case 'share':
        video.shares += 1;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}
