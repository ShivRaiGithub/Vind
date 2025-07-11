import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('asset_id');

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    const asset = await mux.video.assets.retrieve(assetId);
    
    return NextResponse.json({
      id: asset.id,
      status: asset.status,
      playback_ids: asset.playback_ids,
      duration: asset.duration,
      aspect_ratio: asset.aspect_ratio,
      created_at: asset.created_at,
    });
  } catch (error) {
    console.error('Error retrieving asset:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve asset' },
      { status: 500 }
    );
  }
}
