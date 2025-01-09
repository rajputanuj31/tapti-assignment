import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/services/youtube';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Missing channelId' },
        { status: 400 }
      );
    }

    const playlists = await YouTubeService.getPlaylists(channelId);
    return NextResponse.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}
