"use client";

import { useWallet } from "@meshsdk/react";
import { useState, useEffect } from "react";

export default function WalletConnect() {
  const { connect, disconnect, connected, name, connecting, wallet } = useWallet();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAddress() {
      if (connected && wallet) {
        try {
          const addr = await wallet.getChangeAddress();
          setAddress(addr);
        } catch (error) {
          console.error("Failed to fetch address", error);
        }
      } else {
        setAddress(null);
      }
    }
    fetchAddress();
  }, [connected, wallet]);

  const handleConnect = async () => {
    try {
      await connect("lace");
    } catch (error) {
      console.error("Connection failed", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setAddress(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl bg-white dark:bg-zinc-900/50 backdrop-blur-md text-zinc-900 dark:text-zinc-100 w-full max-w-md mx-auto transition-all duration-300">
      <div className="flex items-center space-x-3 mb-8">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-rose-500'} animate-pulse`} />
        <h2 className="text-2xl font-bold tracking-tight">Wallet Status</h2>
      </div>

      {connected ? (
        <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
          <p className="mb-6 text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-5 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            Connected to {name}
          </p>
          <div className="mb-8 w-full text-left">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-semibold uppercase tracking-wider pl-1">Your Address</p>
            <div className="bg-zinc-100 dark:bg-zinc-950/80 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 font-mono text-sm break-all text-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {address ? address : <span className="animate-pulse text-zinc-400">Fetching address...</span>}
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="px-6 py-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded-2xl font-semibold transition-all duration-200 w-full shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 flex justify-center items-center space-x-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Disconnect Wallet</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black rounded-2xl font-semibold transition-all duration-300 w-full shadow-lg hover:shadow-xl flex justify-center items-center space-x-3 transform hover:-translate-y-0.5"
        >
          {connecting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
              <span>Connect Lace Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
