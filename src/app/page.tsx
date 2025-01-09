'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SAMPLE_CHANNELS = [
  { name: 'Google Developers', id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw' },
  { name: 'NASA', id: 'UCLA_DiR1FfKNvjuUpBHmylQ' },
  { name: 'TED', id: 'UCAuUUnT6oDeKwE6v1NGQxug' },
  { name: 'Kurzgesagt', id: 'UCsXVk37bltHxD1rDPwtNM8Q' },
  { name: 'Veritasium', id: 'UCHnyfMqiRRG1u-2MsSQLbXA' },
  { name: 'National Geographic', id: 'UCpVm7bg6pXKo1Pr6k5kxG9A' },
];

export default function Home() {
  const [channelId, setChannelId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelId.trim()) {
      setError('Please enter a channel ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/playlists?channelId=${channelId}`);
      if (!response.ok) {
        throw new Error('Invalid channel ID');
      }
      
      localStorage.setItem('youtubeChannelId', channelId);
      router.push(`/playlists?channelId=${channelId}`);
    } catch (error) {
      setError('Invalid channel ID. Please check and try again.');
      setLoading(false);
    }
  };

  const handleSampleClick = (id: string) => {
    setChannelId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-8 text-center">
            YouTube Playlist Viewer
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="channelId" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Enter YouTube Channel ID
              </label>
              <input
                type="text"
                id="channelId"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="e.g., UCpVm7bg6pXKo1Pr6k5kxG9A"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                         focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         transition-all duration-200"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-3">Sample Channels:</p>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_CHANNELS.map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => handleSampleClick(channel.id)}
                    className="text-left px-3 py-2 rounded-md text-sm
                             hover:bg-indigo-50 dark:hover:bg-gray-600
                             text-gray-700 dark:text-gray-300
                             transition-colors duration-150
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {channel.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg shadow-lg text-sm font-semibold 
                       text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                       hover:from-indigo-700 hover:to-purple-700 
                       focus:outline-none focus:ring-4 focus:ring-indigo-500/50 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform transition-all duration-200 hover:scale-[1.02]
                       active:scale-[0.98]`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-3">Loading...</span>
                </div>
              ) : (
                'View Playlists'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
