"use client";

import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, Hash } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (video: any) => void;
}

const trendingSearches = [
  '#viral', '#comedy', '#art', '#food', '#travel', '#music', '#dance', '#pets'
];

const recentSearches = [
  'funny cats', 'art tutorials', 'travel vlogs', 'cooking tips'
];

export default function SearchModal({ isOpen, onClose, onVideoSelect }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearchList, setRecentSearchList] = useState(recentSearches);

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
      // Add to recent searches
      const newRecent = [query, ...recentSearchList.filter(item => item !== query)].slice(0, 8);
      setRecentSearchList(newRecent);
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
            className="w-full pl-12 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
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
                <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
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

            {/* Recent Searches */}
            {recentSearchList.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-white font-semibold">Recent</h3>
                </div>
                <div className="space-y-2">
                  {recentSearchList.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSubmit(search)}
                      className="flex items-center w-full p-3 hover:bg-gray-800 rounded-lg text-left transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-white">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((video: any) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      onVideoSelect(video);
                      onClose();
                    }}
                    className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform group"
                  >
                    <div className="w-full h-full vind-gradient-diagonal relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <div className="relative text-center p-3">
                        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                          @{video.username}
                        </h4>
                        <p className="text-gray-200 text-xs line-clamp-3">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-center mt-2 text-xs text-gray-300">
                          <span>{video.likes} likes</span>
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
