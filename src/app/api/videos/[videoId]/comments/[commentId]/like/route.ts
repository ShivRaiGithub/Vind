import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { videoId: string; commentId: string } }
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
    
    const comment = await db.collection('comments').findOne({
      _id: new ObjectId(params.commentId),
      videoId: params.videoId,
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const likedBy = comment.likedBy || [];
    const hasLiked = likedBy.includes(username);

    let updateOperation;
    if (hasLiked) {
      // Unlike the comment
      updateOperation = {
        $pull: { likedBy: username },
        $inc: { likes: -1 }
      };
    } else {
      // Like the comment
      updateOperation = {
        $addToSet: { likedBy: username },
        $inc: { likes: 1 }
      };
    }

    await db.collection('comments').updateOne(
      { _id: new ObjectId(params.commentId) },
      updateOperation
    );

    return NextResponse.json({ 
      success: true, 
      isLiked: !hasLiked 
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}
