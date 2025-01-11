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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
        <Link href="/" className="text-indigo-500 hover:text-indigo-600 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          YouTube Playlists
        </h1>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlists/${playlist.id}`}
            className="group"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video relative">
                {playlist.thumbnail && (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {playlist.itemCount} videos
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-indigo-500 transition-colors duration-200 line-clamp-2">
                  {playlist.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {playlist.description}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(playlist.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <span className="text-xs text-indigo-500 group-hover:text-indigo-600">
                    View Playlist →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 