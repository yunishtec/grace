'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMusicStore, Track } from '@/store/useMusicStore';

/** ICONS **/
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
  Repeat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  Back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><path d="M15 18l-6-6 6-6"/></svg>,
  Queue: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [activeTab, setActiveTab] = useState<'reco' | 'search' | 'queue' | 'playlist'>('reco');
  const [isSearching, setIsSearching] = useState(false);
  const [showPlayerQueue, setShowPlayerQueue] = useState(false);

  const { 
    currentTrack, isPlaying, setIsPlaying, setCurrentTrack, 
    volume, setVolume, playlist, togglePlaylist, queue,
    currentTime, duration, isFullPlayer, setFullPlayer,
    playNext, playPrevious, seekTo
  } = useMusicStore();

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch(`/api/recommendations`);
      const data = await res.json();
      if (Array.isArray(data)) setRecommendations(data);
    } catch (e) { console.error('Reco failed', e); }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
        setActiveTab('search');
      }
    } catch (error) { console.error('Search failed:', error); }
    finally { setIsSearching(false); }
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setFullPlayer(true);
  };

  const tracksToDisplay = 
    activeTab === 'search' ? results : 
    activeTab === 'queue' ? queue : 
    activeTab === 'playlist' ? playlist :
    recommendations;

  return (
    <main className="flex flex-col h-dvh bg-white text-black overflow-hidden font-sans select-none antialiased">
      {/* HEADER */}
      <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-black z-40">
        <h2 className="font-extrabold uppercase tracking-[0.6em] text-[10px] text-center flex-1">G R A C E</h2>
        <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-600'}`} />
      </header>

      {/* DISCOVER FEED */}
      <section className="flex-1 overflow-y-auto no-scrollbar p-6 pb-64 bg-white relative">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-5xl font-black tracking-tight uppercase leading-none mb-6">Discovery</h1>
            <div className="flex border-2 border-black bg-white focus-within:ring-4 ring-black/5 transition-all">
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="SEARCH_AUDIO" 
                className="flex-1 p-4 font-bold uppercase focus:outline-none placeholder:text-zinc-200"
              />
              <button onClick={() => handleSearch(searchQuery)} className="px-6 bg-black text-white font-black hover:bg-zinc-800 uppercase tracking-widest text-[10px]">Run</button>
            </div>
          </div>

          {/* HORIZONTAL CAROUSEL */}
          <div className="flex flex-col gap-6">
            <h3 className="font-black uppercase text-xs tracking-widest border-l-4 border-black pl-3">_Trending_Data</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
              {recommendations.slice(0, 10).map((track, i) => (
                <div key={`trend-${track.id}-${i}`} className="flex-shrink-0 w-40 cursor-pointer group" onClick={() => handlePlayTrack(track)}>
                  <div className="aspect-square border-2 border-black overflow-hidden group-hover:shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all bg-zinc-50">
                    <img src={track.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="mt-3">
                    <p className="font-extrabold text-[10px] uppercase truncate leading-tight" dangerouslySetInnerHTML={{ __html: track.title }} />
                    <p className="text-[8px] font-bold opacity-30 mt-1 uppercase tracking-widest">{track.channel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIST VIEW */}
          <div className="flex flex-col gap-8">
            <nav className="flex gap-8 border-b border-black/10 pb-2 text-[10px] font-extrabold tracking-widest uppercase text-black/20">
              {['search', 'reco', 'playlist', 'queue'].map(id => {
                if (id === 'search' && results.length === 0) return null;
                const active = activeTab === id;
                return (
                  <button key={id} onClick={() => setActiveTab(id as any)} className={`transition-all relative ${active ? 'text-black opacity-100' : 'hover:opacity-100'}`}>
                    {id === 'search' ? 'Result' : id === 'reco' ? 'Active' : id === 'playlist' ? 'Saved' : 'Queue'}
                    {active && <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-red-600" />}
                  </button>
                );
              })}
            </nav>

            <div className="flex flex-col gap-5">
              {tracksToDisplay.map((track, index) => (
                <div 
                  key={`track-${track.id}-${index}`} 
                  className={`flex items-center gap-5 p-2 transition-all cursor-pointer border-l-2 ${currentTrack?.id === track.id ? 'border-red-600 bg-red-50/30' : 'border-transparent hover:bg-zinc-50'}`}
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="w-12 h-12 border border-black flex-shrink-0 overflow-hidden"><img src={track.thumbnail} alt="" className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[11px] uppercase truncate" dangerouslySetInnerHTML={{ __html: track.title }} />
                    <p className="text-[8px] opacity-30 font-black uppercase tracking-widest">{track.channel}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); togglePlaylist(track); }} className={`w-8 h-8 p-1 ${playlist.find(t => t.id === track.id) ? 'text-red-600 opacity-100' : 'opacity-10 hover:opacity-100 transition-all'}`}>
                    <Icons.Heart active={Boolean(playlist.find(t => t.id === track.id))} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
