'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/store/useMusicStore';

export default function YouTubePlayer() {
  const { 
    currentTrack, isPlaying, setIsPlaying, playNext, 
    volume, setCurrentTime, setDuration, seekToTime 
  } = useMusicStore();
  
  const playerRef = useRef<any>(null);
  const isReady = useRef(false);
  const timeUpdateInterval = useRef<any>(null);

  useEffect(() => {
    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            onReady: (event: any) => {
              isReady.current = true;
              event.target.setVolume(volume);
              if (isPlaying) event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                playNext();
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setDuration(event.target.getDuration());
                
                clearInterval(timeUpdateInterval.current);
                timeUpdateInterval.current = setInterval(() => {
                  if (playerRef.current?.getCurrentTime) {
                    setCurrentTime(playerRef.current.getCurrentTime());
                  }
                }, 500);
              } else {
                clearInterval(timeUpdateInterval.current);
                if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
              }
            },
          },
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => clearInterval(timeUpdateInterval.current);
  }, [playNext, setIsPlaying, setCurrentTime, setDuration]);

  // Handle Seek Requests
  useEffect(() => {
    if (isReady.current && playerRef.current?.seekTo && seekToTime !== null) {
      playerRef.current.seekTo(seekToTime, true);
    }
  }, [seekToTime]);

  // Handle Track Changes
  useEffect(() => {
    if (isReady.current && playerRef.current?.loadVideoById && currentTrack) {
      playerRef.current.loadVideoById(currentTrack.id);
      setIsPlaying(true);
    }
  }, [currentTrack, setIsPlaying]);

  // Handle Play/Pause
  useEffect(() => {
    if (isReady.current && playerRef.current) {
      if (isPlaying) {
        if (playerRef.current.getPlayerState?.() !== 1) playerRef.current.playVideo();
      } else {
        if (playerRef.current.getPlayerState?.() !== 2) playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  // Handle Volume
  useEffect(() => {
    if (isReady.current && playerRef.current?.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  return (
    <div style={{ position: 'absolute', left: '-9999px', pointerEvents: 'none' }} aria-hidden="true">
      <div id="youtube-player" />
    </div>
  );
}
