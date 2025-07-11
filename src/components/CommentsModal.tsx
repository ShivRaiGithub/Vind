"use client";

import { useState, useEffect } from 'react';
import { X, Send, Heart, MoreHorizontal } from 'lucide-react';

interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
  verified: boolean;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoUsername: string;
}

export default function CommentsModal({ isOpen, onClose, videoId, videoUsername }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser] = useState('you'); // In real app, get from auth

  // Mock comments data
  useEffect(() => {
    if (isOpen) {
      // Simulate loading comments
      const mockComments: Comment[] = [
        {
          id: '1',
          username: videoUsername,
          text: 'Thanks for watching! 🙌',
          likes: 45,
          timestamp: '2h',
          isLiked: false,
          verified: true,
        },
        {
          id: '2',
          username: 'fan_account',
          text: 'This is absolutely amazing! How did you do this?',
          likes: 12,
          timestamp: '1h',
          isLiked: true,
          verified: false,
        },
        {
          id: '3',
          username: 'creative_soul',
          text: 'Incredible work! 🔥 Following for more content like this',
          likes: 8,
          timestamp: '45m',
          isLiked: false,
          verified: false,
        },
        {
          id: '4',
          username: 'daily_viewer',
          text: 'Been following since day one, love your content!',
          likes: 23,
          timestamp: '30m',
          isLiked: false,
          verified: false,
        },
        {
          id: '5',
          username: 'art_lover',
          text: 'Tutorial please! 🎨',
          likes: 6,
          timestamp: '15m',
          isLiked: false,
          verified: false,
        },
      ];
      setComments(mockComments);
    }
  }, [isOpen, videoUsername]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    const comment: Comment = {
      id: Date.now().toString(),
      username: currentUser,
      text: newComment.trim(),
      likes: 0,
      timestamp: 'now',
      isLiked: false,
      verified: false,
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setIsLoading(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-gray-900 rounded-t-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Comments</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              {/* Avatar */}
              <div className="w-8 h-8 vind-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-black">
                  {comment.username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white text-sm">
                      {comment.username}
                    </span>
                    {comment.verified && (
                      <div className="w-4 h-4 vind-gradient rounded-full flex items-center justify-center">
                        <span className="text-xs text-black">✓</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">{comment.text}</p>
                </div>

                {/* Comment Actions */}
                <div className="flex items-center space-x-4 mt-2 ml-2">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>
                  <button className="text-xs text-gray-400 hover:text-white transition-colors">
                    Reply
                  </button>
                  <button className="text-xs text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">No comments yet</p>
              <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 vind-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-black">
                {currentUser.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-green-400 pr-12"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 vind-gradient rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
