import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token response error:', errorData);
      throw new Error('Failed to exchange code for token');
    }

    const data = await tokenResponse.json();
    
    // Get the cookies instance
    const cookieStore = cookies();
    
    // Store the access token in an HTTP-only cookie
    cookieStore.set('youtube_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });

    // If we received a refresh token, store it as well
    if (data.refresh_token) {
      cookieStore.set('youtube_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    // Fetch the user's channel ID
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=id&mine=true',
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!channelResponse.ok) {
      throw new Error('Failed to fetch channel ID');
    }

    const channelData = await channelResponse.json();
    const channelId = channelData.items[0]?.id;

    if (!channelId) {
      throw new Error('No channel ID found');
    }

    // Store the channel ID in a cookie
    cookieStore.set('youtube_channel_id', channelId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });

    // Redirect to the playlists page with the channel ID
    const baseUrl = process.env.GOOGLE_REDIRECT_URI!.split('/api/auth/callback')[0];
    return Response.redirect(`${baseUrl}/playlists?channelId=${channelId}`);
  } catch (error) {
    console.error('Error during authentication:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}