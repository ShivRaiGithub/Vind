import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    const comments = await db.collection('comments')
      .find({ videoId: params.videoId })
      .sort({ createdAt: -1 })
      .toArray();

    // Format timestamps for display
    const formattedComments = comments.map(comment => ({
      ...comment,
      id: comment._id.toString(),
      timestamp: formatTimestamp(comment.createdAt),
    }));

    return NextResponse.json({ 
      success: true, 
      comments: formattedComments 
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { text, username } = await request.json();

    if (!text || !username) {
      return NextResponse.json(
        { error: 'Text and username are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const comment = {
      videoId: params.videoId,
      username,
      text,
      likes: 0,
      likedBy: [],
      createdAt: new Date(),
      verified: false, // You can add logic to check if user is verified
    };

    const result = await db.collection('comments').insertOne(comment);
    
    // Update the video's comment count
    await db.collection('videos').updateOne(
      { 
        $or: [
          { id: params.videoId },
          { _id: new ObjectId(params.videoId) }
        ]
      },
      { $inc: { comments: 1 } }
    );
    
    const newComment = {
      ...comment,
      id: result.insertedId.toString(),
      timestamp: 'now',
      isLiked: false,
    };

    return NextResponse.json({ 
      success: true, 
      comment: newComment 
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w`;
}
