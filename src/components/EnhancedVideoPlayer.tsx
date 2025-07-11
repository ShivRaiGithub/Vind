"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, MoreHorizontal } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

interface EnhancedVideoPlayerProps {
  video: {
    id: number | string;
    username: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    playback_id?: string;
    created_at: string;
    verified?: boolean;
  };
  isActive: boolean;
  onPlayStateChange?: (playing: boolean) => void;
}

export default function EnhancedVideoPlayer({ 
  video, 
  isActive, 
  onPlayStateChange 
}: EnhancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    } else if (!isActive && playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      playerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleVideoClick = () => {
    handlePlayPause();
    showControlsTemporarily();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return `${Math.floor(diffInDays / 7)}w`;
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Video Player */}
      {video.playback_id && video.playback_id.startsWith('demo-') ? (
        // Demo placeholder for videos without real Mux playback_id
        <div 
          className="w-full h-full vind-gradient-diagonal animate-gradient vind-pulse flex items-center justify-center cursor-pointer"
          onClick={handleVideoClick}
        >
          <div className="text-center">
            {!isPlaying ? (
              <Play className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
            ) : (
              <div className="w-16 h-16 mx-auto mb-4 bg-black/20 rounded-full flex items-center justify-center">
                <Pause className="w-8 h-8" />
              </div>
            )}
            <p className="text-lg opacity-75 drop-shadow-md">
              {isPlaying ? 'Playing...' : 'Tap to play'}
            </p>
          </div>
        </div>
      ) : (
        <div 
          className="relative w-full h-full cursor-pointer"
          onClick={handleVideoClick}
        >
          <MuxPlayer
            ref={playerRef}
            playbackId={video.playback_id}
            loop
            muted={isMuted}
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e: any) => {
              const current = e.target.currentTime;
              const total = e.target.duration;
              setCurrentTime(current);
              setDuration(total);
              setProgress((current / total) * 100);
            }}
            onLoadedMetadata={(e: any) => {
              setDuration(e.target.duration);
            }}
            style={{ 
              '--media-object-fit': 'cover',
              '--media-object-position': 'center',
            } as any}
          />
        </div>
      )}

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 pointer-events-auto">
            <button onClick={handlePlayPause} className="text-white">
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Video Info Overlay */}
      <div className="absolute bottom-20 left-4 right-20 z-10 pointer-events-none">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 vind-gradient rounded-full flex items-center justify-center mr-3 pointer-events-auto">
            <span className="text-sm font-bold text-black">
              {video.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white">@{video.username}</span>
              {video.verified && (
                <div className="w-4 h-4 vind-gradient rounded-full flex items-center justify-center">
                  <span className="text-xs text-black">✓</span>
                </div>
              )}
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm">{formatRelativeTime(video.created_at)}</span>
            </div>
          </div>
          <button className="ml-auto pointer-events-auto p-2 hover:bg-black/20 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <p className="text-white text-sm mb-3 leading-relaxed pr-4">
          {video.description}
        </p>
        
        <div className="flex items-center space-x-4 text-xs text-gray-300">
          <span>#{video.id}</span>
          <span>•</span>
          <span>{duration > 0 ? formatTime(duration) : '6s'}</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleMuteToggle}
          className="p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full vind-gradient transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
