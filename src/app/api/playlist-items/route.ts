import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');

  if (!playlistId) {
    return new Response('Missing playlistId parameter', { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('youtube_access_token')?.value;

    let headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // Construct the base endpoint URL
    let endpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50`;

    // If we have an access token, use OAuth
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      // If no access token, use API key
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        throw new Error('YouTube API key is not configured');
      }
      endpoint += `&key=${apiKey}`;
    }

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);
      throw new Error('Failed to fetch playlist items');
    }

    const data = await response.json();

    // Transform the data properly
    const formattedItems = data.items.map((item: any) => {
      const thumbnail =
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url ||
        null;

      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail,
        videoId: item.contentDetails.videoId,
        publishedAt: item.snippet.publishedAt,
        position: item.snippet.position,
      };
    });

    return Response.json(formattedItems);
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return new Response('Failed to fetch playlist items', { status: 500 });
  }
}
