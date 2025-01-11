import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
    console.error('Missing required environment variables');
    return new Response('Server configuration error', { status: 500 });
  }

  const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const scope = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'profile',
    'email'
  ].join(' ');
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope,
    access_type: 'offline',
    include_granted_scopes: 'false',
    prompt: 'consent'
  });

  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  return Response.redirect(authUrl);
} 