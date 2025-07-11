"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import EnhancedVideoPlayer from "@/components/EnhancedVideoPlayer";
import VideoUpload from "@/components/VideoUpload";
import SearchModal from "@/components/SearchModal";
import CommentsModal from "@/components/CommentsModal";
import UserProfile from "@/components/UserProfile";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";

interface Video {
  id: number | string;
  username: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  playback_id?: string;
  created_at: string;
  verified?: boolean;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<number | string>>(new Set());
  const [savedVideos, setSavedVideos] = useState<Set<number | string>>(new Set());
  const [showWelcome, setShowWelcome] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedVideoForComments, setSelectedVideoForComments] = useState<Video | null>(null);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load videos from API
  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    // Hide welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/videos?limit=20');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      // Fallback to empty array if API fails
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (videoId: number | string) => {
    const isCurrentlyLiked = likedVideos.has(videoId);
    
    // Optimistic update
    setLikedVideos(prev => {
      const newLiked = new Set(prev);
      if (isCurrentlyLiked) {
        newLiked.delete(videoId);
      } else {
        newLiked.add(videoId);
      }
      return newLiked;
    });

    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, likes: isCurrentlyLiked ? video.likes - 1 : video.likes + 1 }
        : video
    ));

    // Update server
    try {
      await fetch(`/api/videos?id=${videoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isCurrentlyLiked ? 'unlike' : 'like' }),
      });
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setLikedVideos(prev => {
        const newLiked = new Set(prev);
        if (isCurrentlyLiked) {
          newLiked.add(videoId);
        } else {
          newLiked.delete(videoId);
        }
        return newLiked;
      });
    }
  };

  const handleSave = (videoId: number | string) => {
    setSavedVideos(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(videoId)) {
        newSaved.delete(videoId);
      } else {
        newSaved.add(videoId);
      }
      return newSaved;
    });
  };

  const handleShare = async (videoId: number | string) => {
    try {
      await fetch(`/api/videos?id=${videoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'share' }),
      });

      // Update local state
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, shares: video.shares + 1 }
          : video
      ));

      // Web Share API or fallback
      if (navigator.share) {
        await navigator.share({
          title: `Check out this Vind by @${videos.find(v => v.id === videoId)?.username}`,
          text: videos.find(v => v.id === videoId)?.description,
          url: `${window.location.origin}/video/${videoId}`,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComments = (video: Video) => {
    setSelectedVideoForComments(video);
    setShowComments(true);
  };

  const handleProfileView = (username: string) => {
    setSelectedUsername(username);
    setShowProfile(true);
  };

  const handleUploadComplete = (newVideo: Video) => {
    setVideos(prev => [newVideo, ...prev]);
  };

  const handleVideoSelect = (video: Video) => {
    const videoIndex = videos.findIndex(v => v.id === video.id);
    if (videoIndex !== -1) {
      setCurrentVideo(videoIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 vind-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-black">V</span>
          </div>
          <p className="text-white">Loading Vinds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      {/* Main Video Feed */}
      <main className="pt-16 pb-20 snap-y snap-mandatory overflow-y-scroll h-screen">
        <div className="max-w-md mx-auto">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={video.id} className="relative h-screen snap-start">
                <EnhancedVideoPlayer
                  video={video}
                  isActive={index === currentVideo}
                  onPlayStateChange={(playing) => {
                    if (playing && index !== currentVideo) {
                      setCurrentVideo(index);
                    }
                  }}
                />

                {/* Action Buttons */}
                <div className="absolute bottom-24 right-4 flex flex-col items-center space-y-6 z-10">
                  <button
                    onClick={() => handleLike(video.id)}
                    className="flex flex-col items-center group"
                  >
                    <div className={`p-3 rounded-full ${
                      likedVideos.has(video.id) ? 'bg-green-500/20' : 'bg-black/20'
                    } backdrop-blur-sm border border-white/10 hover:scale-110 transition-all`}>
                      <Heart 
                        className={`w-6 h-6 ${
                          likedVideos.has(video.id) ? 'fill-green-400 text-green-400' : 'text-white'
                        }`}
                      />
                    </div>
                    <span className="text-xs mt-1 text-white font-medium">
                      {video.likes}
                    </span>
                  </button>

                  <button
                    onClick={() => handleComments(video)}
                    className="flex flex-col items-center group"
                  >
                    <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:scale-110 transition-all">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs mt-1 text-white font-medium">
                      {video.comments}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSave(video.id)}
                    className="flex flex-col items-center group"
                  >
                    <div className={`p-3 rounded-full ${
                      savedVideos.has(video.id) ? 'bg-yellow-500/20' : 'bg-black/20'
                    } backdrop-blur-sm border border-white/10 hover:scale-110 transition-all`}>
                      <Bookmark 
                        className={`w-6 h-6 ${
                          savedVideos.has(video.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white'
                        }`}
                      />
                    </div>
                  </button>

                  <button
                    onClick={() => handleShare(video.id)}
                    className="flex flex-col items-center group"
                  >
                    <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:scale-110 transition-all">
                      <Share className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs mt-1 text-white font-medium">
                      {video.shares}
                    </span>
                  </button>
                </div>

                {/* Username click handler */}
                <button
                  onClick={() => handleProfileView(video.username)}
                  className="absolute bottom-28 left-4 right-20 z-10 text-left"
                >
                  {/* This overlay makes the username area clickable */}
                  <div className="absolute inset-0" />
                </button>
              </div>
            ))
          ) : (
            <div className="h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 mb-4">No videos to show</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="vind-gradient text-black px-6 py-2 rounded-full font-semibold"
                >
                  Upload First Video
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation 
        onUploadClick={() => setShowUpload(true)}
        onSearchClick={() => setShowSearch(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      {/* Modals */}
      {showUpload && (
        <VideoUpload
          onClose={() => setShowUpload(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {showSearch && (
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onVideoSelect={handleVideoSelect}
        />
      )}

      {showComments && selectedVideoForComments && (
        <CommentsModal
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          videoId={selectedVideoForComments.id.toString()}
          videoUsername={selectedVideoForComments.username}
        />
      )}

      {showProfile && (
        <UserProfile
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          username={selectedUsername}
        />
      )}

      {/* Welcome Message Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-8 border-2 border-transparent bg-gradient-to-r from-green-400/20 to-cyan-400/20 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 vind-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-black drop-shadow-sm">V</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome to Vind!
            </h2>
            <p className="text-gray-300 mb-4">The modern way to share short videos</p>
            <p className="text-sm text-gray-400 mb-6">Swipe up to explore amazing content</p>
            <button
              onClick={() => setShowWelcome(false)}
              className="vind-gradient text-black font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
