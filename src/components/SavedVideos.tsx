"use client";

import { useState, useEffect } from 'react';
import { X, Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SavedVideosProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (video: any) => void;
}

interface SavedVideo {
  id: string;
  thumbnail?: string;
  likes: number;
  views: number;
  description: string;
  created_at: string;
  playback_id?: string;
  username: string;
}

export default function SavedVideos({ isOpen, onClose, onVideoSelect }: SavedVideosProps) {
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Fetch saved videos
  const fetchSavedVideos = async () => {
    if (!user?.username) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/videos/saved?username=${encodeURIComponent(user.username)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved videos');
      }
      
      if (data.success) {
        setSavedVideos(data.videos);
      }
    } catch (err) {
      console.error('Error fetching saved videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load saved videos');
    } finally {
      setLoading(false);
    }
  };

  // Handle video click
  const handleVideoClick = (video: SavedVideo) => {
    onVideoSelect(video);
    onClose();
  };

  // Fetch data when component opens
  useEffect(() => {
    if (isOpen && user?.username) {
      fetchSavedVideos();
    }
  }, [isOpen, user?.username]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Saved Videos</h1>
        <div className="w-9 h-9"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
              <p className="text-white">Loading saved videos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20 px-6">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchSavedVideos}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        ) : savedVideos.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-4 gap-1">
              {savedVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="aspect-[3/4] bg-gray-800 rounded-md overflow-hidden relative group"
                >
                  <div className="w-full h-full vind-gradient-diagonal relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="relative text-center">
                      <h2 className="text-lg font-bold text-black mb-1">VIND</h2>
                      <span className="text-xs text-black bg-white/20 px-1 py-0.5 rounded">
                        @{video.username}
                      </span>
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
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="text-xs text-white bg-black/50 px-1 py-0.5 rounded">
                        @{video.username}
                      </span>
                      <span>♥ {formatNumber(video.likes)}</span>
                    </div>
                  </div>
                  
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No saved videos</h3>
            <p className="text-gray-400 px-6">
              Videos you save will appear here so you can watch them later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
