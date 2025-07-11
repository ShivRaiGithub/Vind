"use client";

import { useState } from "react";
import { Play, Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";

interface VideoCardProps {
  video: {
    id: number;
    username: string;
    description: string;
    likes: number;
    comments: number;
    src: string;
  };
  isLiked: boolean;
  onLike: (videoId: number) => void;
  onPlay: () => void;
}

export default function VideoCard({ video, isLiked, onLike, onPlay }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
    onPlay();
  };

  return (
    <div className="relative h-screen snap-start bg-black">
      {/* Video Container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Placeholder gradient background */}
        <div className="w-full h-full vind-gradient-diagonal animate-gradient vind-pulse flex items-center justify-center">
          <div className="text-center">
            <Play 
              className={`w-16 h-16 mx-auto mb-4 cursor-pointer hover:scale-110 transition-all duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'} drop-shadow-lg`}
              onClick={handlePlayClick}
            />
            {!isPlaying && (
              <p className="text-lg opacity-75 drop-shadow-md">Tap to play video</p>
            )}
          </div>
        </div>
        
        {/* Actual video element (hidden for demo) */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          loop
          muted
          playsInline
        >
          {/* Video source would go here */}
        </video>

        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Video Information */}
      <div className="absolute bottom-20 left-4 right-20 z-10">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full vind-gradient flex items-center justify-center mr-3">
            <span className="text-sm font-bold">{video.username.charAt(0).toUpperCase()}</span>
          </div>
          <span className="font-semibold text-white">@{video.username}</span>
          <button className="ml-auto">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-white text-sm mb-2 leading-relaxed">{video.description}</p>
        <div className="flex items-center space-x-4 text-xs text-gray-300">
          <span>#{video.id}</span>
          <span>•</span>
          <span>6s</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-24 right-4 flex flex-col items-center space-y-6 z-10">
        <button
          onClick={() => onLike(video.id)}
          className="flex flex-col items-center group"
        >
          <div className={`p-2 rounded-full ${isLiked ? 'bg-green-500/20' : 'bg-black/20'} backdrop-blur-sm border border-white/10`}>
            <Heart 
              className={`w-6 h-6 ${isLiked ? 'fill-green-400 text-green-400' : 'text-white'} group-hover:scale-110 transition-all`}
            />
          </div>
          <span className="text-xs mt-1 text-white">{video.likes + (isLiked ? 1 : 0)}</span>
        </button>

        <button className="flex flex-col items-center group">
          <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-all" />
          </div>
          <span className="text-xs mt-1 text-white">{video.comments}</span>
        </button>

        <button className="flex flex-col items-center group">
          <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
            <Share className="w-6 h-6 text-white group-hover:scale-110 transition-all" />
          </div>
          <span className="text-xs mt-1 text-white">Share</span>
        </button>
      </div>
    </div>
  );
}
