"use client";

import { useState, useEffect } from 'react';
import { X, Send, Heart, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  onCommentAdded?: () => void; // Callback when a comment is successfully added
}

export default function CommentsModal({ isOpen, onClose, videoId, videoUsername, onCommentAdded }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();

  // Fetch comments from database
  useEffect(() => {
    if (isOpen && videoId) {
      fetchComments();
    }
  }, [isOpen, videoId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`);
      const data = await response.json();
      
      // Set the isLiked property based on whether current user liked each comment
      const commentsWithLikeStatus = (data.comments || []).map((comment: any) => ({
        ...comment,
        isLiked: comment.likedBy?.includes(user?.username || '') || false,
      }));
      
      setComments(commentsWithLikeStatus);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user?.username) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment.trim(),
          username: user?.username || 'anonymous',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add the new comment to the top of the list
        setComments([data.comment, ...comments]);
        setNewComment('');
        
        // Notify parent component that a comment was added
        onCommentAdded?.();
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    // Optimistic update
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    );
    setComments(updatedComments);

    try {
      const response = await fetch(`/api/videos/${videoId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user?.username || 'anonymous',
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        setComments(comments);
        console.error('Failed to like comment');
      }
    } catch (error) {
      // Revert optimistic update on error
      setComments(comments);
      console.error('Error liking comment:', error);
    }
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
          {isLoading && comments.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
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
          ))
          ) : (
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
                {(user?.username || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                placeholder={user?.username ? "Add a comment..." : "Please log in to comment"}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 pr-12"
                disabled={isLoading || !user?.username}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isLoading || !user?.username}
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
