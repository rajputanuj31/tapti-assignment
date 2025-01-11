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

    // Prepare Set-Cookie headers
    const cookies = [
      `youtube_access_token=${data.access_token}; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`,
    ];

    if (data.refresh_token) {
      cookies.push(
        `youtube_refresh_token=${data.refresh_token}; HttpOnly; Secure; SameSite=Lax`
      );
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

    cookies.push(
      `youtube_channel_id=${channelId}; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`
    );

    // Redirect to the playlists page with Set-Cookie headers
    const baseUrl = process.env.GOOGLE_REDIRECT_URI!.split('/api/auth/callback')[0];
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: `${baseUrl}/playlists?channelId=${channelId}`,
        'Set-Cookie': cookies.join(', '),
      },
    });

    return response;
  } catch (error) {
    console.error('Error during authentication:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}
