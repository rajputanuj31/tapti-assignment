'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  publishedAt: string;
}

export default function PlaylistsContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const channelId = searchParams.get('channelId');

  useEffect(() => {
    if (!channelId) {
      router.push('/');
      return;
    }

    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`/api/playlists?channelId=${channelId}`);
        if (!response.ok) throw new Error('Failed to fetch playlists');
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        setError('Failed to load playlists');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [channelId, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {playlists.map((playlist) => (
        <Link href={`/playlists/${playlist.id}`} key={playlist.id}>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            {playlist.thumbnail && (
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <h2 className="text-xl font-bold mt-2">{playlist.title}</h2>
            <p className="text-gray-600 mt-1">{playlist.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {playlist.itemCount} videos
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
} 