// src/components/VideoPlayer.tsx
'use client';

import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="player-wrapper mt-4">
      <ReactPlayer
        className="react-player"
        url={videoUrl}
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  );
};

export default VideoPlayer;