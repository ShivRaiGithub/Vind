import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection, getVideosCollection, connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// User profile type
interface UserProfile {
  _id?: ObjectId;
  username: string;
  displayName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  verified: boolean;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  createdAt: Date;
  lastActive: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const currentUserId = searchParams.get('currentUser'); // For follow status

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const usersCollection = await getUsersCollection();
    const videosCollection = await getVideosCollection();
    const { db } = await connectToDatabase();

    // Get user profile
    const userProfile = await usersCollection.findOne({ username });
    
    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's videos with stats
    const userVideos = await videosCollection.find({ 
      username: username 
    }).sort({ created_at: -1 }).toArray();

    // Calculate stats
    const videoCount = userVideos.length;
    const totalLikes = userVideos.reduce((sum, video) => sum + (video.likes || 0), 0);
    
    // Handle both old schema (numbers) and new schema (arrays) for followers/following
    let followerCount = 0;
    let followingCount = 0;
    let followersArray: string[] = [];
    
    if (Array.isArray(userProfile.followers)) {
      followersArray = userProfile.followers;
      followerCount = userProfile.followers.length;
    } else if (typeof userProfile.followers === 'number') {
      followerCount = userProfile.followers;
      followersArray = [];
    }
    
    if (Array.isArray(userProfile.following)) {
      followingCount = userProfile.following.length;
    } else if (typeof userProfile.following === 'number') {
      followingCount = userProfile.following;
    }

    // Check if current user is following this profile
    const isFollowing = currentUserId && followersArray.length > 0
      ? followersArray.includes(currentUserId) 
      : false;

    // Format user videos for response
    const formattedVideos = userVideos.map(video => ({
      id: video._id.toString(),
      thumbnail: video.thumbnail || null,
      likes: video.likes || 0,
      views: video.views || 0,
      description: video.description,
      created_at: video.created_at,
      playback_id: video.playback_id
    }));

    // Get liked videos if requested
    const showLiked = searchParams.get('tab') === 'liked';
    let likedVideos: any[] = [];
    
    if (showLiked) {
      // Get liked video IDs from user_likes collection
      const userLikes = await db.collection('user_likes').find({
        username: username
      }).sort({ likedAt: -1 }).toArray();
      
      if (userLikes.length > 0) {
        const likedVideoIds = userLikes.map((like: any) => like.videoId);
        const likedVideoObjectIds = likedVideoIds.map((id: string) => {
          try {
            return new ObjectId(id);
          } catch {
            return null;
          }
        }).filter((id): id is ObjectId => id !== null);
        
        // Find videos by their IDs (both string and ObjectId format)
        const likedVideosData = await videosCollection.find({
          $or: [
            { id: { $in: likedVideoIds } },
            { _id: { $in: likedVideoObjectIds } }
          ]
        }).sort({ created_at: -1 }).toArray();
        
        likedVideos = likedVideosData.map(video => ({
          id: video._id?.toString() || video.id,
          thumbnail: video.thumbnail || null,
          likes: video.likes || 0,
          views: video.views || 0,
          description: video.description,
          created_at: video.created_at,
          playback_id: video.playback_id,
          username: video.username
        }));
      }
    }

    const response = {
      profile: {
        username: userProfile.username,
        displayName: userProfile.displayName,
        bio: userProfile.bio || '',
        profilePicture: userProfile.profilePicture,
        verified: userProfile.verified || false,
        joinedDate: userProfile.createdAt,
        stats: {
          videos: videoCount,
          followers: followerCount,
          following: followingCount,
          likes: totalLikes
        }
      },
      videos: formattedVideos,
      likedVideos: showLiked ? likedVideos : [],
      isFollowing,
      success: true
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username, currentUserId } = body;

    if (!username || !currentUserId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const usersCollection = await getUsersCollection();

    if (action === 'follow' || action === 'unfollow') {
      const targetUser = await usersCollection.findOne({ username });
      const currentUser = await usersCollection.findOne({ _id: new ObjectId(currentUserId) });

      if (!targetUser || !currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Migrate old schema to new schema if needed
      if (!Array.isArray(targetUser.followers)) {
        await usersCollection.updateOne(
          { username },
          { $set: { followers: [] } }
        );
        targetUser.followers = [];
      }
      
      if (!Array.isArray(currentUser.following)) {
        await usersCollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $set: { following: [] } }
        );
        currentUser.following = [];
      }

      if (action === 'follow') {
        // Add current user to target's followers
        await usersCollection.updateOne(
          { username },
          { $addToSet: { followers: currentUserId } }
        );
        
        // Add target user to current user's following
        await usersCollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $addToSet: { following: targetUser._id.toString() } }
        );

        return NextResponse.json({ 
          success: true, 
          isFollowing: true,
          message: `You are now following ${username}` 
        });
      } else {
        // Remove current user from target's followers
        await usersCollection.updateOne(
          { username },
          { $pull: { followers: currentUserId } }
        );
        
        // Remove target user from current user's following
        await usersCollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $pull: { following: targetUser._id.toString() } as any }
        );

        return NextResponse.json({ 
          success: true, 
          isFollowing: false,
          message: `You unfollowed ${username}` 
        });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error updating follow status:', error);
    return NextResponse.json(
      { error: 'Failed to update follow status' },
      { status: 500 }
    );
  }
}
