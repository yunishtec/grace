'use client';

export default function SettingsPage() {
  return (
    <main className="flex flex-col h-dvh bg-white text-black overflow-hidden font-sans select-none antialiased">
      <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-black z-40">
        <h2 className="font-extrabold uppercase tracking-[0.6em] text-[10px] text-center flex-1">G R A C E _ C O N F I G</h2>
      </header>

      <section className="flex-1 overflow-y-auto no-scrollbar p-6 pb-64 bg-white relative">
        <div className="flex flex-col gap-10">
          <div>
             <h1 className="text-5xl font-black tracking-tight uppercase leading-none mb-2">System</h1>
             <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em]">Node_Parameters</p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="border-[3px] border-black p-5 shadow-[8px_8px_0_0_#000]">
               <h3 className="font-black uppercase tracking-widest text-sm mb-4 border-b border-black/10 pb-2">Data Integrity</h3>
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Local_Cache</span>
                  <span className="text-[10px] font-black uppercase text-green-500">ACTIVE</span>
               </div>
               <p className="text-[10px] font-bold opacity-40 leading-relaxed uppercase">
                 Your saved records (Library & Volume State) are currently persisted in the Local Storage block of your device. Cloud synchronization is offline.
               </p>
            </div>

            <div className="border-2 border-black p-5">
               <h3 className="font-black uppercase tracking-widest text-sm mb-4 border-b border-black/10 pb-2">Audio Engine</h3>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Iframe_Pipeline</span>
                  <span className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase">v3.0.1</span>
               </div>
            </div>

            <button className="w-full py-4 border-2 border-black font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95">
                CLEAR_NETWORK_CACHE
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
