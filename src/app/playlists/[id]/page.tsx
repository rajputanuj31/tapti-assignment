'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PlaylistItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  videoId: string;
  publishedAt: string;
  position: number;
}

export default function PlaylistItemsPage() {
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  useEffect(() => {
    if (!playlistId) {
      router.push('/');
      return;
    }

    const fetchPlaylistItems = async () => {
      try {
        const response = await fetch(`/api/playlist-items?playlistId=${playlistId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch playlist items');
        }
        const data = await response.json();
        setPlaylistItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load playlist items');
        setLoading(false);
      }
    };

    fetchPlaylistItems();
  }, [playlistId, router]);

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
          <Link href="/playlists" className="mt-4 text-indigo-500 hover:underline">
            Back to Playlists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Playlist Videos
        </h1>
        <Link
          href="/playlists"
          className="text-indigo-500 hover:text-indigo-600 font-medium"
        >
          ← Back to Playlists
        </Link>
      </div>

      {playlistItems.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No videos found in this playlist.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {playlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 lg:w-96">
                  <a
                    href={`https://www.youtube.com/watch?v=${item.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video bg-gray-200 dark:bg-gray-700"
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </a>
                </div>
                <div className="p-6 flex-1">
                  <a
                    href={`https://www.youtube.com/watch?v=${item.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-indigo-500"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {item.title}
                    </h2>
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Added: {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 