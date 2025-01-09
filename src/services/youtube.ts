import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.NEXT_PUBLIC_YOUTUBE_ACCESS_TOKEN
});

export interface PlaylistItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoId: string;
  publishedAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
}

export class YouTubeService {
  static async getPlaylists(channelId: string): Promise<Playlist[]> {
    const response = await youtube.playlists.list({
      part: ['snippet', 'contentDetails'],
      channelId: channelId,
      maxResults: 50,
    });

    return response.data.items?.map(item => ({
      id: item.id!,
      title: item.snippet!.title!,
      description: item.snippet!.description!,
      thumbnailUrl: item.snippet!.thumbnails?.default?.url!,
      itemCount: item.contentDetails!.itemCount!,
    })) || [];
  }

  static async getPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
    const response = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId: playlistId,
      maxResults: 50,
    });

    return response.data.items?.map(item => ({
      id: item.id!,
      title: item.snippet!.title!,
      description: item.snippet!.description!,
      thumbnailUrl: item.snippet!.thumbnails?.default?.url!,
      videoId: item.snippet!.resourceId?.videoId!,
      publishedAt: item.snippet!.publishedAt!,
    })) || [];
  }
}