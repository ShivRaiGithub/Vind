/**
 * Script to upload the actual video files to Mux and get real asset IDs
 * This simulates what would happen when a real user uploads videos
 */

import Mux from '@mux/mux-node';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import path from 'path';

// Initialize Mux with environment variables
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

interface UploadedVideo {
  filename: string;
  description: string;
  username: string;
  assetId: string;
  playbackId: string;
  uploadId: string;
  duration?: number;
}

const videoDescriptions = [
  {
    filename: 'vecteezy_natural-landscape-green-rice-fields-evening-in-the-rainy_26966365.mp4',
    uploads: [
      {
        username: 'nature_lover',
        description: 'Evening vibes in the rice fields 🌾 Nothing beats the peaceful sound of rain on green fields #nature #peaceful #rain #countryside'
      },
      {
        username: 'wanderlust_diary', 
        description: 'Found this hidden gem during my evening walk 🌅 The way the light hits the water is just magical ✨ #travel #goldenhour #hiddengems'
      },
      {
        username: 'earth_explorer',
        description: 'This is why I love rainy season 💚 Pure tranquility in nature #monsoon #greenery #meditation #mindfulness'
      },
      {
        username: 'zen_moments',
        description: 'Sometimes you need to pause and appreciate the simple beauty around us 🧘‍♀️ #zen #naturetherapy #mindfulliving'
      }
    ]
  },
  {
    filename: '5896379-uhd_2160_3840_24fps.mp4',
    uploads: [
      {
        username: 'cinematic_vibes',
        description: 'When the lighting is just perfect 🎬 Shot this in 4K and the quality is insane! #cinematography #4k #filmmaker'
      },
      {
        username: 'visual_artist',
        description: 'Experimenting with different angles and compositions 📐 What do you think of this shot? #art #visual #composition #creative'
      },
      {
        username: 'content_creator', 
        description: 'Behind the scenes of my latest project 🎥 The quality difference in 4K is mind-blowing! #bts #content #creatorlife'
      },
      {
        username: 'tech_reviewer',
        description: 'Testing out this new camera setup 📱 The results speak for themselves! #tech #camera #quality #review'
      }
    ]
  }
];

async function uploadVideoToMux(filePath: string, description: string): Promise<UploadedVideo> {
  try {
    console.log(`Starting upload for: ${path.basename(filePath)}`);
    
    // Create a direct upload
    const upload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'baseline',
        max_resolution_tier: '1080p',
      },
    });

    console.log(`Created upload URL for ${path.basename(filePath)}: ${upload.url}`);

    // Read the file
    const fileStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);
    
    // Upload the file using multipart form data
    const formData = new FormData();
    formData.append('file', fileStream, {
      filename: path.basename(filePath),
      contentType: 'video/mp4',
      knownLength: fileStats.size
    });

    console.log(`Uploading file ${path.basename(filePath)} (${fileStats.size} bytes)...`);

    const uploadResponse = await fetch(upload.url, {
      method: 'PUT',
      body: fileStream,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': fileStats.size.toString(),
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    console.log(`Upload completed for ${path.basename(filePath)}`);

    // Wait for the asset to be created
    let asset;
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max

    console.log('Waiting for asset to be processed...');
    
    while (attempts < maxAttempts) {
      const uploadStatus = await mux.video.uploads.retrieve(upload.id);
      
      if (uploadStatus.asset_id) {
        asset = await mux.video.assets.retrieve(uploadStatus.asset_id);
        if (asset.status === 'ready' && asset.playback_ids && asset.playback_ids.length > 0) {
          break;
        }
      }
      
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}: Asset status: ${asset?.status || 'processing'}`);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    }

    if (!asset || !asset.playback_ids || asset.playback_ids.length === 0) {
      throw new Error('Asset processing failed or timed out');
    }

    console.log(`Asset ready! Asset ID: ${asset.id}, Playback ID: ${asset.playback_ids[0].id}`);

    return {
      filename: path.basename(filePath),
      description,
      username: '', // Will be set by caller
      assetId: asset.id,
      playbackId: asset.playback_ids[0].id,
      uploadId: upload.id,
      duration: asset.duration || 14,
    };

  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    throw error;
  }
}

async function uploadAllVideos(): Promise<UploadedVideo[]> {
  const uploadedVideos: UploadedVideo[] = [];
  
  for (const videoGroup of videoDescriptions) {
    const filePath = path.join(process.cwd(), 'public', videoGroup.filename);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    // Upload the video file once to Mux
    const baseUpload = await uploadVideoToMux(filePath, videoGroup.uploads[0].description);
    
    // Create multiple entries with the same Mux asset but different descriptions/users
    for (const upload of videoGroup.uploads) {
      uploadedVideos.push({
        ...baseUpload,
        username: upload.username,
        description: upload.description,
      });
    }
  }

  return uploadedVideos;
}

export { uploadAllVideos };
export type { UploadedVideo };

// If running directly
if (require.main === module) {
  uploadAllVideos()
    .then((videos) => {
      console.log('\n=== Upload Results ===');
      videos.forEach((video, index) => {
        console.log(`\n${index + 1}. @${video.username}`);
        console.log(`   Description: ${video.description}`);
        console.log(`   Asset ID: ${video.assetId}`);
        console.log(`   Playback ID: ${video.playbackId}`);
        console.log(`   Duration: ${video.duration}s`);
      });
      
      console.log('\n=== Generated Video Entries ===');
      console.log(JSON.stringify(videos, null, 2));
    })
    .catch((error) => {
      console.error('Upload failed:', error);
      process.exit(1);
    });
}
