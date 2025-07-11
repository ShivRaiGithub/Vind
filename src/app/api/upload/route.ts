import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

// Initialize Mux (you'll need to add your credentials)
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json();

    // Create a direct upload
    const upload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'baseline',
        video_quality: 'plus',
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
    
    return NextResponse.json({
      status: upload.status,
      asset_id: upload.asset_id,
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
