"use client";

import { useWallet } from "../contexts/WalletContext";
import { Loader2, LogOut, Wallet, Sparkles } from "lucide-react";

export function WalletConnect() {
  const { isConnected, address, walletStatus, isConnecting, connect, disconnect } = useWallet();

  return (
    <div className="bezel-shell w-full max-w-md mx-auto h-full">
      <div className="bezel-core p-8 flex flex-col items-center justify-center text-zinc-100 min-h-[350px]">
        <div className="flex items-center space-x-3 mb-10 w-full justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Wallet</h2>
          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-400">Connection</span>
          </div>
        </div>

        {walletStatus === 'checking' ? (
          <div className="text-zinc-500 text-sm animate-pulse flex items-center justify-center flex-1 w-full">
            Checking for Lace Wallet...
          </div>
        ) : isConnected ? (
          <div className="flex flex-col items-center justify-center space-y-6 w-full flex-1 animate-in fade-in zoom-in-95 duration-500">
             <div className="bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner w-full flex flex-col space-y-4">
               <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">Connected Network</span>
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="font-mono text-sm text-emerald-300">Midnight Preprod</span>
                  </div>
               </div>
               <div className="w-full h-[1px] bg-white/5" />
               <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Unshielded Address</span>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 break-all">
                    <span className="font-mono text-xs text-zinc-300">{address}</span>
                  </div>
               </div>
             </div>
             
             <button
               onClick={disconnect}
               className="group px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-400 transition-colors flex items-center space-x-2 border border-rose-500/10 hover:border-rose-500/30"
             >
               <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" />
               <span>Disconnect</span>
             </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 w-full flex-1 animate-in fade-in duration-500">
             <div className="text-center space-y-2 mb-4">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Connect your <span className="text-emerald-400 font-medium">Lace Wallet</span> to interact with the Midnight Network.
                </p>
             </div>

             <button
              onClick={() => connect('preprod')}
              disabled={isConnecting}
              className="group relative px-6 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black rounded-full font-semibold smooth-spring w-full flex justify-between items-center active:scale-[0.98]"
            >
              {isConnecting ? (
                 <div className="flex items-center justify-center w-full space-x-2">
                   <Loader2 size={18} className="animate-spin text-black/50" />
                   <span className="text-black/70">Connecting...</span>
                 </div>
              ) : (
                <>
                  <span className="pl-2">Connect Lace</span>
                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center smooth-spring group-hover:bg-black/20">
                    <Sparkles size={16} className="smooth-spring group-hover:scale-110 group-hover:rotate-12" />
                  </div>
                </>
              )}
            </button>

            {walletStatus === 'not-found' && (
              <div className="mt-2 w-full p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400/80 text-xs font-medium text-center animate-in fade-in slide-in-from-bottom-2">
                Lace Wallet extension not found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
