'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        alert('ACCESS_DENIED: ' + res.error);
      } else {
        router.push('/');
      }
    } catch (err) {
      alert('SYSTEM_FAILURE: Unable to authenticate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-white flex items-center justify-center p-6 antialiased font-sans flex-col selection:bg-red-600 selection:text-white">
      
      <div className="w-full max-w-sm flex flex-col items-center mb-10">
         <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">Grace</h1>
         <div className="flex items-center gap-4 w-full">
            <span className="h-1 flex-1 bg-black" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">System_Auth</p>
            <span className="h-1 flex-1 bg-black" />
         </div>
      </div>

      <form 
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000] rounded-none flex flex-col gap-6"
      >
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-2">
           <h2 className="font-extrabold text-2xl uppercase tracking-tight">Identity</h2>
           <div className={`w-3 h-3 border-2 border-black ${isLoading ? 'bg-yellow-400 animate-spin' : 'bg-red-600'}`} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Network_Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="USER@NODE.COM"
            className="w-full p-4 border-4 border-black bg-white rounded-none font-bold uppercase placeholder:text-zinc-300 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Access_Code</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full p-4 border-4 border-black bg-white rounded-none font-bold placeholder:text-zinc-300 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 p-5 bg-black text-white font-black uppercase tracking-widest text-lg border-4 border-black hover:bg-red-600 hover:text-white transition-all active:translate-x-1.5 active:translate-y-1.5 shadow-[6px_6px_0_0_#ef4444] active:shadow-none disabled:opacity-50"
        >
          {isLoading ? 'Encrypting...' : 'Initialize'}
        </button>
      </form>
      
      <p className="text-[9px] font-bold uppercase mt-12 tracking-widest opacity-30 text-center">
         Grace Audio Streamer v4.0.1<br/>Secure Node Connection Required
      </p>
    </main>
  );
}
