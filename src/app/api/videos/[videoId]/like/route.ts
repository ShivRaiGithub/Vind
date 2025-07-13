import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find the video
    const video = await db.collection('videos').findOne({
      $or: [
        { id: params.videoId },
        { _id: new ObjectId(params.videoId) }
      ]
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const likedBy = video.likedBy || [];
    const hasLiked = likedBy.includes(username);

    let updateOperation;
    if (hasLiked) {
      // Unlike the video
      updateOperation = {
        $pull: { likedBy: username },
        $inc: { likes: -1 }
      };
    } else {
      // Like the video
      updateOperation = {
        $addToSet: { likedBy: username },
        $inc: { likes: 1 }
      };
    }

    await db.collection('videos').updateOne(
      {
        $or: [
          { id: params.videoId },
          { _id: new ObjectId(params.videoId) }
        ]
      },
      updateOperation
    );

    // Store the like in user likes collection for profile page
    if (!hasLiked) {
      await db.collection('user_likes').insertOne({
        username,
        videoId: params.videoId,
        likedAt: new Date()
      });
    } else {
      await db.collection('user_likes').deleteOne({
        username,
        videoId: params.videoId
      });
    }

    return NextResponse.json({ 
      success: true, 
      isLiked: !hasLiked 
    });
  } catch (error) {
    console.error('Error liking video:', error);
    return NextResponse.json(
      { error: 'Failed to like video' },
      { status: 500 }
    );
  }
}
