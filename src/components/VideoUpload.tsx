"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Video, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import * as UpChunk from '@mux/upchunk';

interface VideoUploadProps {
  onClose: () => void;
  onUploadComplete: (videoData: any) => void;
}

export default function VideoUpload({ onClose, onUploadComplete }: VideoUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage('File size must be less than 100MB');
        setUploadStatus('error');
        return;
      }

      // Validate duration (6-15 seconds for Vine-style)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 15) {
          setErrorMessage('Video must be 15 seconds or shorter for the authentic Vine experience');
          setUploadStatus('error');
          return;
        }
        setSelectedFile(file);
        setUploadStatus('idle');
        setErrorMessage('');
      };
      video.src = URL.createObjectURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    multiple: false,
    disabled: uploadStatus === 'uploading' || uploadStatus === 'processing'
  });

  const handleUpload = async () => {
    if (!selectedFile || !username.trim() || !description.trim()) {
      setErrorMessage('Please fill in all fields and select a video');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);

      // Create upload URL from our API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: selectedFile.name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create upload URL');
      }

      const { upload_id, upload_url } = await response.json();

      // Upload to Mux using UpChunk
      const upload = UpChunk.createUpload({
        endpoint: upload_url,
        file: selectedFile,
        chunkSize: 5120, // 5MB chunks
      });

      upload.on('error', (err) => {
        console.error('Upload error:', err);
        setErrorMessage('Upload failed. Please try again.');
        setUploadStatus('error');
      });

      upload.on('progress', (progress) => {
        setUploadProgress(Math.round(progress.detail));
      });

      upload.on('success', async () => {
        setUploadStatus('processing');
        
        // Poll for asset processing
        let attempts = 0;
        const maxAttempts = 30; // 5 minutes max
        
        const pollAsset = async () => {
          try {
            const assetResponse = await fetch(`/api/upload?upload_id=${upload_id}`);
            const assetData = await assetResponse.json();
            
            if (assetData.status === 'asset_created' && assetData.asset_id) {
              // Save video to our database
              const videoResponse = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: username.trim(),
                  description: description.trim(),
                  asset_id: assetData.asset_id,
                  playback_id: assetData.asset_id, // This would normally come from the asset
                }),
              });

              if (videoResponse.ok) {
                const newVideo = await videoResponse.json();
                setUploadStatus('complete');
                setTimeout(() => {
                  onUploadComplete(newVideo);
                  onClose();
                }, 2000);
              }
            } else if (assetData.error) {
              throw new Error(assetData.error.messages?.[0] || 'Processing failed');
            } else {
              attempts++;
              if (attempts < maxAttempts) {
                setTimeout(pollAsset, 10000); // Poll every 10 seconds
              } else {
                throw new Error('Processing timeout');
              }
            }
          } catch (error) {
            console.error('Asset polling error:', error);
            setErrorMessage('Video processing failed. Please try again.');
            setUploadStatus('error');
          }
        };

        pollAsset();
      });

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('Upload failed. Please try again.');
      setUploadStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader className="w-6 h-6 animate-spin" />;
      case 'processing':
        return <Loader className="w-6 h-6 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Video className="w-6 h-6" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return `Uploading... ${uploadProgress}%`;
      case 'processing':
        return 'Processing video...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return errorMessage;
      default:
        return selectedFile ? `Selected: ${selectedFile.name}` : 'Select a video to upload';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Create New Vind</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-green-400 bg-green-400/10'
                : selectedFile
                ? 'border-green-400 bg-green-400/5'
                : 'border-gray-600 hover:border-gray-500'
            } ${uploadStatus === 'uploading' || uploadStatus === 'processing' ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                {getStatusIcon()}
              </div>
              <div>
                <p className="text-white font-medium">
                  {isDragActive ? 'Drop your video here...' : 'Drop a video or click to browse'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {getStatusMessage()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  MP4, MOV, AVI, WebM • Max 100MB • 6-15 seconds recommended
                </p>
              </div>
              {uploadProgress > 0 && uploadStatus === 'uploading' && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="vind-gradient h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's happening in your Vind?"
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/150 characters
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={
              !selectedFile ||
              !username.trim() ||
              !description.trim() ||
              uploadStatus === 'uploading' ||
              uploadStatus === 'processing' ||
              uploadStatus === 'complete'
            }
            className="w-full vind-gradient text-black font-semibold py-3 rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {uploadStatus === 'uploading' || uploadStatus === 'processing'
              ? 'Uploading...'
              : uploadStatus === 'complete'
              ? 'Complete!'
              : 'Share Your Vind'}
          </button>

          {/* Tips */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">💡 Tips for great Vinds:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Keep it short and engaging (6-15 seconds)</li>
              <li>• Good lighting makes a huge difference</li>
              <li>• Add relevant hashtags to your description</li>
              <li>• Vertical videos work best on mobile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
