import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let channelId = searchParams.get('channelId');
  
  const cookieStore = cookies();
  const accessToken = cookieStore.get('youtube_access_token')?.value;

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // If no channelId is provided, use 'mine=true' to get the authenticated user's playlists
    const endpoint = channelId 
      ? `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50`
      : 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=50';

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    
    // Format the response to match our expected structure
    const formattedPlaylists = data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      itemCount: item.contentDetails.itemCount,
      publishedAt: item.snippet.publishedAt,
    }));

    return Response.json(formattedPlaylists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return new Response('Failed to fetch playlists', { status: 500 });
  }
}
