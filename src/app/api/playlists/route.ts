import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let channelId = searchParams.get('channelId');
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('youtube_access_token')?.value;

  try {
    let headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // If we have an access token, use OAuth
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      // If no access token, use API key
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        throw new Error('YouTube API key is not configured');
      }
      channelId = channelId || 'mine'; // Default to 'mine' if no channelId provided
    }

    // Construct the endpoint URL
    let endpoint = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails';
    
    if (accessToken && !channelId) {
      endpoint += '&mine=true';
    } else {
      endpoint += `&channelId=${channelId}`;
    }
    
    endpoint += '&maxResults=50';
    
    // Add API key if we're not using OAuth
    if (!accessToken) {
      endpoint += `&key=${process.env.YOUTUBE_API_KEY}`;
    }

    const response = await fetch(endpoint, { headers });

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
