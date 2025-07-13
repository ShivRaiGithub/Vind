"use client";

import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Hash } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (video: any) => void;
}

const trendingSearches = [
  '#viral', '#comedy', '#art', '#food', '#travel', '#music', '#dance', '#pets'
];

export default function SearchModal({ isOpen, onClose, onVideoSelect }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayedSearch = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);

      return () => clearTimeout(delayedSearch);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/videos?search=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();
      setSearchResults(data.videos || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
            placeholder="Search Vinds..."
            className="w-full pl-12 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 px-4 py-2 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!searchQuery ? (
          <div className="p-4 space-y-6">
            {/* Trending */}
            <div>
              <div className="flex items-center mb-3">
                <TrendingUp className="w-5 h-5 text-primary-500 mr-2" />
                <h3 className="text-white font-semibold">Trending</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSubmit(tag)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <Hash className="w-3 h-3 inline mr-1" />
                    {tag.replace('#', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-4 gap-1">
                {searchResults.map((video: any) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      onVideoSelect(video.id.toString());
                      onClose();
                    }}
                    className="aspect-[3/4] bg-gray-800 rounded-md overflow-hidden hover:scale-[1.02] transition-transform group relative"
                  >
                    <div className="w-full h-full vind-gradient-diagonal relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="relative text-center">
                        <h2 className="text-lg font-bold text-black mb-1">VIND</h2>
                        <h4 className="text-black font-medium text-xs mb-0.5 line-clamp-1">
                          @{video.username}
                        </h4>
                        <div className="flex items-center justify-center text-xs text-black/80">
                          <span className="flex items-center">
                            <span className="mr-1">♥</span>
                            {video.likes ? (video.likes > 999 ? `${(video.likes / 1000).toFixed(1)}k` : video.likes) : '0'}
                          </span>
                        </div>
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
                        <div className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <div className="w-0 h-0 border-l-[4px] border-l-white border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No results found for "{searchQuery}"</p>
                <p className="text-gray-500 text-sm mt-1">Try different keywords or check trending tags</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
