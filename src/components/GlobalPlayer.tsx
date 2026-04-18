'use client';

import { useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Icons = {
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M8 5v14l11-7z"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>,
  Next: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>,
  Prev: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>,
  Heart: ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  Shuffle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5"/></svg>,
  Back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><path d="M15 18l-6-6 6-6"/></svg>,
  Queue: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  Browse: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.6.86 1 1.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

export default function GlobalPlayer() {
  const pathname = usePathname();
  const [showPlayerQueue, setShowPlayerQueue] = useState(false);

  const { 
    currentTrack, isPlaying, setIsPlaying, setCurrentTrack, 
    volume, setVolume, playlist, togglePlaylist, queue,
    currentTime, duration, isFullPlayer, setFullPlayer,
    playNext, playPrevious, seekTo
  } = useMusicStore();

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* FLOATING MINI PLAYER & DOCK */}
      {!isFullPlayer && (
        <footer className="fixed bottom-0 left-0 right-0 z-50 p-6 flex flex-col items-center pointer-events-none select-none">
          {currentTrack && (
            <div 
              className="w-full max-w-sm bg-black text-white p-4 border border-white/20 flex items-center gap-4 pointer-events-auto mb-4 animate-in slide-in-from-bottom shadow-2xl"
              onClick={() => setFullPlayer(true)}
            >
                <div className="w-10 h-10 border border-white/20 overflow-hidden flex-shrink-0">
                  <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[10px] uppercase truncate tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: currentTrack.title }} />
                  <p className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">{isPlaying ? 'Streaming' : 'Paused'}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="w-10 h-10 bg-white text-black p-2 hover:bg-zinc-200 transition-colors">
                  {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                </button>
            </div>
          )}

          <nav className="w-full max-w-xs bg-black text-white p-1 rounded-full border border-white/20 flex justify-around items-center pointer-events-auto shadow-2xl">
              {[
                { id: '/', icon: <Icons.Browse />, label: 'BROWSE' },
                { id: '/saved', icon: <Icons.Star />, label: 'SAVED' },
                { id: '/settings', icon: <Icons.Settings />, label: 'SYSTEM' }
              ].map((node) => {
                const isActive = pathname === node.id;
                return (
                  <Link href={node.id} key={node.id} className={`flex flex-col items-center gap-1 p-3 transition-opacity w-16 ${isActive ? 'opacity-100 text-red-500' : 'opacity-30 hover:opacity-100'}`}>
                    <div className="w-5 h-5">{node.icon}</div>
                    <span className="text-[6px] font-black tracking-widest">{node.label}</span>
                  </Link>
                );
              })}
          </nav>
        </footer>
      )}

      {/* FULL STATION PLAYER */}
      {isFullPlayer && currentTrack && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col bg-grid transition-all animate-in slide-in-from-bottom duration-500 overflow-hidden h-dvh select-none font-sans">
           <header className="flex justify-between items-center p-6 border-b border-black bg-white/90 backdrop-blur-sm z-10 shrink-0">
              <button onClick={() => setFullPlayer(false)} className="w-12 h-12 border-2 border-black flex items-center justify-center bg-white hover:bg-zinc-50 active:scale-90 transition-all p-3">
                 <Icons.Back />
              </button>
              <div className="text-center">
                 <h2 className="font-black text-[10px] tracking-[0.4em] uppercase">Grace_Hub</h2>
                 <p className="text-[7px] font-bold opacity-30 mt-1 uppercase">Freq: 88.4 / Linked</p>
              </div>
              <button onClick={() => setShowPlayerQueue(!showPlayerQueue)} className={`w-12 h-12 border-2 border-black flex items-center justify-center transition-all p-3 ${showPlayerQueue ? 'bg-black text-white shadow-none' : 'bg-white hover:bg-zinc-50'}`}>
                 <Icons.Queue />
              </button>
           </header>

           <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center p-6 pb-24 gap-6 max-w-sm mx-auto w-full relative">
              {showPlayerQueue && (
                  <div className="absolute inset-x-0 top-0 bottom-[140px] bg-white border-2 border-black z-50 flex flex-col p-6 animate-in slide-in-from-right duration-300">
                     <p className="font-black text-[9px] border-b border-black/10 pb-3 mb-4 uppercase tracking-[0.4em] opacity-40 italic">Up_Next_Node</p>
                     <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
                        {(queue.length > 0 ? queue : []).map((track, i) => (
                          <div key={`q-${i}`} className="flex items-center gap-4 p-1 hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => { setCurrentTrack(track); setIsPlaying(true); }}>
                             <div className="w-10 h-10 border border-black flex-shrink-0"><img src={track.thumbnail} alt="" className="w-full h-full object-cover" /></div>
                             <p className="text-[10px] font-extrabold uppercase truncate flex-1">{track.title}</p>
                          </div>
                        ))}
                     </div>
                  </div>
              )}

              <div className="w-full aspect-square border-[3px] border-black shadow-[15px_15px_0_0_#000] relative overflow-hidden group shrink-0">
                 <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover scale-105 transition-transform duration-500" />
                 {isPlaying && <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest animate-pulse">On_Air</div>}
              </div>

              <div className="w-full border-y border-black/5 py-4 shrink-0 mt-4">
                 <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-3 text-center truncate" dangerouslySetInnerHTML={{ __html: currentTrack.title }} />
                 <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.5em] text-center italic">{currentTrack.channel}</p>
              </div>

              {/* SURGICAL SEEKER */}
              <div className="w-full px-2 shrink-0">
                 <input 
                    type="range" min="0" max={duration} value={currentTime}
                    onChange={(e) => seekTo(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-200 border-none appearance-none cursor-pointer accent-black mb-4 [&::-webkit-slider-thumb]:bg-red-600"
                 />
                 <div className="flex justify-between font-extrabold text-[8px] tracking-[0.3em] uppercase opacity-30">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-red-500 opacity-100 italic">{isPlaying ? 'Active' : 'Standby'}</span>
                    <span>{formatTime(duration)}</span>
                 </div>
              </div>

              {/* MASTER CONTROLS */}
              <div className="w-full flex flex-col gap-6 mt-2 shrink-0">
                 <div className="flex items-center gap-6 bg-zinc-50 px-4 py-2 border border-black/5 rounded-full">
                    <span className="text-[8px] font-black opacity-30 uppercase">Vol</span>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="flex-1 h-0.5 bg-black/10 appearance-none accent-black" />
                 </div>

                 <div className="flex justify-between items-center w-full px-4">
                    <button className="w-8 h-8 opacity-20 p-1 hover:opacity-100 transition-opacity"><Icons.Shuffle /></button>
                    <div className="flex items-center gap-10">
                       <button onClick={playPrevious} className="w-6 h-6 active:scale-75 transition-transform"><Icons.Prev /></button>
                       <button onClick={() => setIsPlaying(!isPlaying)} className="w-20 h-20 bg-black text-white flex items-center justify-center p-6 shadow-[8px_8px_0_0_#ef4444] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                          {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                       </button>
                       <button onClick={playNext} className="w-6 h-6 active:scale-75 transition-transform"><Icons.Next /></button>
                    </div>
                    <button onClick={() => togglePlaylist(currentTrack)} className={`w-8 h-8 p-1 transition-all active:scale-[1.2] ${playlist.find(t => t.id === currentTrack.id) ? 'text-red-600' : 'opacity-20 hover:opacity-100'}`}>
                       <Icons.Heart active={Boolean(playlist.find(t => t.id === currentTrack.id))} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
