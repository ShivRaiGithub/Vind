import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import jwt from 'jsonwebtoken';

// Initialize Mux (you'll need to add your credentials)
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || request.cookies.get('vind_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to upload videos.' },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token. Please log in again.' },
        { status: 401 }
      );
    }

    const { filename } = await request.json();

    // Create a direct upload
    const upload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'baseline',
        max_resolution_tier: '1080p',
      },
    });

    return NextResponse.json({
      upload_id: upload.id,
      upload_url: upload.url,
    });
  } catch (error) {
    console.error('Error creating upload:', error);
    return NextResponse.json(
      { error: 'Failed to create upload' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uploadId = searchParams.get('upload_id');

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }

    const upload = await mux.video.uploads.retrieve(uploadId);
    
    // If asset is created, get the playback ID
    let playback_id = null;
    if (upload.asset_id) {
      try {
        const asset = await mux.video.assets.retrieve(upload.asset_id);
        if (asset.playback_ids && asset.playback_ids.length > 0) {
          playback_id = asset.playback_ids[0].id;
        }
      } catch (assetError) {
        console.error('Error retrieving asset:', assetError);
      }
    }
    
    return NextResponse.json({
      status: upload.status,
      asset_id: upload.asset_id,
      playback_id: playback_id,
      error: upload.error,
    });
  } catch (error) {
    console.error('Error retrieving upload:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve upload' },
      { status: 500 }
    );
  }
}
