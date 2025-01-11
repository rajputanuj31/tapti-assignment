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

export default function PlaylistsPage() {
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
        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }
        const data = await response.json();
        setPlaylists(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load playlists');
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [channelId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <Link href="/" className="mt-4 text-indigo-500 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          YouTube Playlists
        </h1>
        <Link
          href="/"
          className="text-indigo-500 hover:text-indigo-600 font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {playlists.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No playlists found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlists/${playlist.id}`}
              className="block group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                            transform transition-transform duration-200 hover:scale-105">
                <div className="aspect-video relative">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white 
                                px-2 py-1 rounded text-sm">
                    {playlist.itemCount} videos
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white 
                               group-hover:text-indigo-500 line-clamp-2">
                    {playlist.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {playlist.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    {new Date(playlist.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 