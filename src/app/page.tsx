'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Playlist, PlaylistItem } from '@/services/youtube';

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CHANNEL_ID = 'UCpVm7bg6pXKo1Pr6k5kxG9A'; 

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/playlists?channelId=${CHANNEL_ID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Failed to load playlists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchPlaylistItems = async () => {
      if (!selectedPlaylist) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/playlist-items?playlistId=${selectedPlaylist}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlaylistItems(data);
      } catch (error) {
        console.error('Error fetching playlist items:', error);
        setError('Failed to load playlist items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedPlaylist) {
      fetchPlaylistItems();
    }
  }, [selectedPlaylist]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">YouTube Playlists</h1>
      
      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedPlaylist === playlist.id
                    ? 'bg-gray-200 dark:bg-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
                onClick={() => setSelectedPlaylist(playlist.id)}
              >
                <div className="flex gap-4">
                  <Image
                    src={playlist.thumbnailUrl}
                    alt={playlist.title}
                    width={90}
                    height={60}
                    className="rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{playlist.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {playlist.itemCount} videos
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {playlistItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex gap-4">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    width={120}
                    height={90}
                    className="rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
