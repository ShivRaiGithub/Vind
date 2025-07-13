"use client";

import { useState, useEffect } from 'react';
import { X, Grid3X3, Heart, MessageCircle, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onVideoSelect?: (video: UserVideo) => void;
}

interface UserProfile {
  _id?: any;
  username: string;
  displayName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  verified: boolean;
  joinedDate: string;
  stats: {
    followers: number;
    following: number;
    likes: number;
    videos: number;
  };
}

interface UserVideo {
  id: string;
  thumbnail?: string;
  likes: number;
  views: number;
  description: string;
  created_at: string;
  playback_id?: string;
  username?: string; // For liked videos
}

export default function UserProfile({ isOpen, onClose, username, onVideoSelect }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked'>('videos');
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [likedVideos, setLikedVideos] = useState<UserVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  
  const { user } = useAuth();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Fetch user profile data
  const fetchUserProfile = async (tab: 'videos' | 'liked' = 'videos') => {
    if (!username) return;
    
    console.log('Fetching profile for:', username, 'with current user:', user?.id);
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        username,
        tab,
        ...(user?.id && { currentUser: user.id })
      });
      
      console.log('Profile API call params:', Object.fromEntries(params));
      
      const response = await fetch(`/api/users/profile?${params}`);
      const data = await response.json();
      
      console.log('Profile API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }
      
      if (data.success) {
        setProfile(data.profile);
        setVideos(data.videos);
        setLikedVideos(data.likedVideos);
        setIsFollowing(data.isFollowing);
        console.log('Profile loaded successfully, isFollowing:', data.isFollowing);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!user?.id || !profile) {
      console.log('Follow toggle failed: missing user or profile', { user: user?.id, profile: profile?.username });
      return;
    }
    
    console.log('Attempting to follow/unfollow:', {
      action: isFollowing ? 'unfollow' : 'follow',
      targetUsername: profile.username,
      currentUserId: user.id,
      currentUserAuth: user
    });
    
    setFollowLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isFollowing ? 'unfollow' : 'follow',
          username: profile.username,
          currentUserId: user.id
        })
      });
      
      const data = await response.json();
      console.log('Follow API response:', data);
      
      if (data.success) {
        setIsFollowing(data.isFollowing);
        // Update follower count
        if (profile) {
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
              followers: profile.stats.followers + (data.isFollowing ? 1 : -1)
            }
          });
        }
      } else {
        console.error('Follow operation failed:', data.error);
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle video click
  const handleVideoClick = (video: UserVideo) => {
    if (onVideoSelect) {
      onVideoSelect(video);
      onClose(); // Close profile modal when video is selected
    }
  };

  // Handle tab change
  const handleTabChange = (tab: 'videos' | 'liked') => {
    setActiveTab(tab);
    if (tab === 'liked' && likedVideos.length === 0) {
      fetchUserProfile(tab);
    }
  };

  // Fetch data when component opens or username changes
  useEffect(() => {
    if (isOpen && username) {
      fetchUserProfile(activeTab);
    }
  }, [isOpen, username]);

  // Render video grid item
  const renderVideoGridItem = (video: UserVideo, showUsername = false) => (
    <div
      key={video.id}
      className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer"
      onClick={() => handleVideoClick(video)}
    >
      <div className="w-full h-full vind-gradient-diagonal relative flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="relative text-center">
          <h2 className="text-lg font-bold text-black">VIND</h2>
        </div>
        {/* Video for hover preview */}
        {video.playback_id && (
          <video
            src={`https://stream.mux.com/${video.playback_id}.m3u8`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-80 transition-opacity duration-300"
            muted
            playsInline
            loop
            onMouseEnter={(e) => {
              const videoEl = e.target as HTMLVideoElement;
              videoEl.currentTime = 0;
              videoEl.play().catch(() => {});
            }}
            onMouseLeave={(e) => {
              const videoEl = e.target as HTMLVideoElement;
              videoEl.pause();
              videoEl.currentTime = 0;
            }}
          />
        )}
      </div>
      
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>{formatNumber(video.likes)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{formatNumber(video.views)}</span>
          </div>
        </div>
      </div>
      
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
        </div>
      </div>
      
      {showUsername && video.username && (
        <div className="absolute top-2 left-2">
          <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
            @{video.username}
          </span>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  // Show loading state
  if (loading && !profile) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Show profile not found
  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-gray-400 mb-4">Profile not found</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">@{profile.username}</h1>
          <div className="w-9 h-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="px-4 py-6">
          {/* Avatar and Stats */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-20 h-20 vind-gradient rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-xl font-bold text-white">{profile.displayName}</h2>
                {profile.verified && (
                  <div className="w-5 h-5 vind-gradient rounded-full flex items-center justify-center">
                    <span className="text-xs text-black">✓</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(profile.stats.videos)}</div>
                  <div className="text-gray-400">Videos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(profile.stats.followers)}</div>
                  <div className="text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(profile.stats.following)}</div>
                  <div className="text-gray-400">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(profile.stats.likes)}</div>
                  <div className="text-gray-400">Likes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-white text-sm leading-relaxed mb-4">
              {profile.bio}
            </p>
          )}

          {/* Join Date */}
          <div className="flex items-center text-gray-400 text-sm mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Joined {formatDate(profile.joinedDate)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {user?.username !== profile.username && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading || !user}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  isFollowing
                    ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
                    : 'vind-gradient text-black hover:scale-105'
                } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {followLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  isFollowing ? 'Following' : 'Follow'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => handleTabChange('videos')}
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
                activeTab === 'videos'
                  ? 'text-white border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => handleTabChange('liked')}
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
                activeTab === 'liked'
                  ? 'text-white border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Liked</span>
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : activeTab === 'videos' ? (
            videos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {videos.map((video) => renderVideoGridItem(video))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid3X3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No videos yet</p>
                <p className="text-gray-500 text-sm">Videos will appear here when they're posted</p>
              </div>
            )
          ) : (
            likedVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {likedVideos.map((video) => renderVideoGridItem(video, true))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No liked videos yet</p>
                <p className="text-gray-500 text-sm">Videos you like will appear here</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}