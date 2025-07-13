import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get saved video IDs from user_saves collection
    const userSaves = await db.collection('user_saves').find({
      username: username
    }).sort({ savedAt: -1 }).toArray();

    if (userSaves.length === 0) {
      return NextResponse.json({ 
        success: true, 
        videos: [] 
      });
    }

    const savedVideoIds = userSaves.map((save: any) => save.videoId);
    const savedVideoObjectIds = savedVideoIds.map((id: string) => {
      try {
        return new ObjectId(id);
      } catch {
        return null;
      }
    }).filter((id): id is ObjectId => id !== null);

    // Find videos by their IDs
    const savedVideosData = await db.collection('videos').find({
      $or: [
        { id: { $in: savedVideoIds } },
        { _id: { $in: savedVideoObjectIds } }
      ]
    }).toArray();

    const formattedVideos = savedVideosData.map((video: any) => ({
      id: video._id?.toString() || video.id,
      thumbnail: video.thumbnail || null,
      likes: video.likes || 0,
      views: video.views || 0,
      description: video.description,
      created_at: video.created_at,
      playback_id: video.playback_id,
      username: video.username
    }));

    return NextResponse.json({ 
      success: true, 
      videos: formattedVideos 
    });
  } catch (error) {
    console.error('Error fetching saved videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { videoId, username, action } = await request.json();

    if (!videoId || !username || !action) {
      return NextResponse.json(
        { error: 'Video ID, username, and action are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    if (action === 'save') {
      // Save the video
      await db.collection('user_saves').insertOne({
        username,
        videoId,
        savedAt: new Date()
      });
    } else if (action === 'unsave') {
      // Unsave the video
      await db.collection('user_saves').deleteOne({
        username,
        videoId
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "save" or "unsave"' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      action 
    });
  } catch (error) {
    console.error('Error saving/unsaving video:', error);
    return NextResponse.json(
      { error: 'Failed to save/unsave video' },
      { status: 500 }
    );
  }
}
