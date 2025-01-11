import { Suspense } from 'react';
import PlaylistsContent from './PlaylistsContent';

export default function PlaylistsPage() {
  return (
    <Suspense fallback={<div>Loading playlists...</div>}>
      <PlaylistsContent />
    </Suspense>
  );
} 