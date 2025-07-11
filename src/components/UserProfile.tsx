"use client";

import { useState } from 'react';
import { X, Settings, Share, MoreHorizontal, Grid3X3, Heart, MessageCircle, Calendar } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  verified: boolean;
  joinedDate: string;
  profilePicture?: string;
}

const mockUserProfile: UserProfile = {
  username: 'creative_user',
  displayName: 'Creative User',
  bio: 'Artist & Creator 🎨 | Sharing my journey through visual storytelling | DM for collaborations ✨',
  followers: 12400,
  following: 856,
  likes: 98200,
  videos: 147,
  verified: true,
  joinedDate: '2023-03-15',
};

const mockUserVideos = [
  { id: 1, thumbnail: 'video1', likes: 1234, views: 15600 },
  { id: 2, thumbnail: 'video2', likes: 892, views: 12300 },
  { id: 3, thumbnail: 'video3', likes: 2341, views: 28900 },
  { id: 4, thumbnail: 'video4', likes: 567, views: 8900 },
  { id: 5, thumbnail: 'video5', likes: 1876, views: 22100 },
  { id: 6, thumbnail: 'video6', likes: 3421, views: 41200 },
];

export default function UserProfile({ isOpen, onClose, username }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked'>('videos');
  const [isFollowing, setIsFollowing] = useState(false);

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

  if (!isOpen) return null;

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
          <h1 className="text-lg font-semibold text-white">@{mockUserProfile.username}</h1>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="px-4 py-6">
          {/* Avatar and Stats */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-20 h-20 vind-gradient rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">
                {mockUserProfile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-xl font-bold text-white">{mockUserProfile.displayName}</h2>
                {mockUserProfile.verified && (
                  <div className="w-5 h-5 vind-gradient rounded-full flex items-center justify-center">
                    <span className="text-xs text-black">✓</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(mockUserProfile.videos)}</div>
                  <div className="text-gray-400">Videos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(mockUserProfile.followers)}</div>
                  <div className="text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(mockUserProfile.following)}</div>
                  <div className="text-gray-400">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(mockUserProfile.likes)}</div>
                  <div className="text-gray-400">Likes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-white text-sm leading-relaxed mb-4">
            {mockUserProfile.bio}
          </p>

          {/* Join Date */}
          <div className="flex items-center text-gray-400 text-sm mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Joined {formatDate(mockUserProfile.joinedDate)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                isFollowing
                  ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
                  : 'vind-gradient text-black hover:scale-105'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
              <Share className="w-5 h-5 text-white" />
            </button>
            <button className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
                activeTab === 'videos'
                  ? 'text-white border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
                activeTab === 'liked'
                  ? 'text-white border-b-2 border-green-400'
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
          {activeTab === 'videos' ? (
            <div className="grid grid-cols-3 gap-1">
              {mockUserVideos.map((video) => (
                <div
                  key={video.id}
                  className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer"
                >
                  <div className="w-full h-full vind-gradient-diagonal relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">No liked videos yet</p>
              <p className="text-gray-500 text-sm">Videos you like will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
