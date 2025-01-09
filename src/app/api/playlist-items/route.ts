import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/services/youtube';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playlistId = searchParams.get('playlistId');

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Missing playlistId' },
        { status: 400 }
      );
    }

    const items = await YouTubeService.getPlaylistItems(playlistId);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist items' },
      { status: 500 }
    );
  }
} 