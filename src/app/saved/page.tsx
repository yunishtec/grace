'use client';

import { useMusicStore } from '@/store/useMusicStore';
import Link from 'next/link';

export default function SavedPage() {
  const { playlist, setCurrentTrack, setIsPlaying, setFullPlayer, togglePlaylist } = useMusicStore();

  const handlePlay = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setFullPlayer(true);
  };

  return (
    <main className="flex flex-col h-dvh bg-white text-black overflow-hidden font-sans select-none antialiased">
      <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-black z-40">
        <h2 className="font-extrabold uppercase tracking-[0.6em] text-[10px] text-center flex-1">G R A C E _ L I B R A R Y</h2>
      </header>

      <section className="flex-1 overflow-y-auto no-scrollbar p-6 pb-64 bg-white relative">
        <div className="flex flex-col gap-10">
          <div>
             <h1 className="text-5xl font-black tracking-tight uppercase leading-none mb-2">Saved</h1>
             <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em]">Local_Nodes: {playlist.length}</p>
          </div>

          <div className="flex flex-col gap-5">
            {playlist.length === 0 ? (
               <div className="py-20 text-center border-2 border-dashed border-black/10">
                  <p className="text-xs font-black uppercase tracking-widest opacity-20">NO_RECORDS_FOUND</p>
                  <Link href="/" className="mt-4 inline-block px-6 py-2 border-2 border-black font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all">Browse Data</Link>
               </div>
            ) : (
              playlist.map((track, index) => (
                <div 
                  key={`saved-${track.id}-${index}`} 
                  className="flex items-center gap-5 p-2 transition-all cursor-pointer border-l-2 border-transparent hover:bg-zinc-50 hover:border-black group"
                  onClick={() => handlePlay(track)}
                >
                  <div className="w-16 h-16 border border-black flex-shrink-0 overflow-hidden shadow-[4px_4px_0_0_#000] group-hover:shadow-none transition-all">
                     <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[11px] uppercase truncate" dangerouslySetInnerHTML={{ __html: track.title }} />
                    <p className="text-[8px] opacity-30 font-black uppercase tracking-widest mt-1">{track.channel}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); togglePlaylist(track); }} className="px-4 py-2 text-xs font-black uppercase text-red-600 hover:bg-red-50 transition-colors">
                     REMOVE
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
