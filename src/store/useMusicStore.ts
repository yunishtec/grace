import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

interface MusicState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Track[];
  queue: Track[];
  currentTime: number;
  duration: number;
  isFullPlayer: boolean;
  seekToTime: number | null; // Used to trigger seeks in the player
  
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTrack: (track: Track | null) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setFullPlayer: (open: boolean) => void;
  seekTo: (time: number) => void;
  
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  
  togglePlaylist: (track: Track) => void;
  clearPlaylist: () => void;
  
  playNext: () => void;
  playPrevious: () => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 80,
      playlist: [],
      queue: [],
      currentTime: 0,
      duration: 0,
      isFullPlayer: false,
      seekToTime: null,

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true, currentTime: 0, seekToTime: null }),
      setVolume: (volume) => set({ volume }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setFullPlayer: (isFullPlayer) => set({ isFullPlayer }),
      
      seekTo: (time) => set({ seekToTime: time, currentTime: time }),

      addToQueue: (track) => {
        const { queue } = get();
        if (!queue.find(t => t.id === track.id)) {
          set({ queue: [...queue, track] });
        }
      },
      removeFromQueue: (trackId) => set({ queue: get().queue.filter(t => t.id !== trackId) }),
      clearQueue: () => set({ queue: [] }),

      togglePlaylist: (track) => {
        const { playlist } = get();
        const exists = playlist.find(t => t.id === track.id);
        if (exists) {
          set({ playlist: playlist.filter(t => t.id !== track.id) });
        } else {
          set({ playlist: [...playlist, track] });
        }
      },
      clearPlaylist: () => set({ playlist: [] }),

      playNext: () => {
        const { queue, currentTrack } = get();
        if (queue.length === 0) return;
        const index = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
        const nextTrack = queue[(index + 1) % queue.length];
        set({ currentTrack: nextTrack, isPlaying: true });
      },
      
      playPrevious: () => {
        const { queue, currentTrack } = get();
        if (queue.length === 0) return;
        const index = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
        const prevTrack = queue[(index - 1 + queue.length) % queue.length];
        set({ currentTrack: prevTrack, isPlaying: true });
      }
    }),
    {
      name: 'grace-storage',
      partialize: (state) => ({ playlist: state.playlist, volume: state.volume }),
    }
  )
);
