"use client";

import { useState } from "react";
import { generateAgeProof } from "../lib/zkp";
import { ShieldCheck, Loader2, Sparkles } from "lucide-react";

export default function AgeVerifier() {
  const [birthYear, setBirthYear] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [proofResult, setProofResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProveAge = async () => {
    setLoading(true);
    setError(null);
    setProofResult(null);

    const yearNum = parseInt(birthYear);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setError("Please enter a valid birth year.");
      setLoading(false);
      return;
    }

    try {
      const currentYear = new Date().getFullYear();
      const result = await generateAgeProof(yearNum, currentYear);
      setProofResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate proof.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bezel-shell w-full max-w-md mx-auto">
      <div className="bezel-core p-8 flex flex-col items-center justify-center text-zinc-100 min-h-[350px]">
        <div className="flex items-center space-x-3 mb-10 w-full justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Identity</h2>
          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-400">ZK Proof</span>
          </div>
        </div>

        <div className="w-full mb-6 relative group">
          <label className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-2 pl-1">Birth Year (Private)</label>
          <div className="relative">
            <input 
              type="number" 
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1995"
              className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-center text-xl tracking-widest shadow-inner placeholder:text-zinc-700"
            />
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/5 group-hover:border-white/10 transition-colors" />
          </div>
        </div>

        <button
          onClick={handleProveAge}
          disabled={loading || !birthYear}
          className="group relative px-6 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black rounded-full font-semibold smooth-spring w-full flex justify-between items-center active:scale-[0.98]"
        >
          {loading ? (
             <div className="flex items-center justify-center w-full space-x-2">
               <Loader2 size={18} className="animate-spin text-black/50" />
               <span className="text-black/70">Generating...</span>
             </div>
          ) : (
            <>
              <span className="pl-2">Verify Age</span>
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center smooth-spring group-hover:bg-black/20">
                <Sparkles size={16} className="smooth-spring group-hover:scale-110 group-hover:rotate-12" />
              </div>
            </>
          )}
        </button>

        {error && (
          <div className="mt-6 w-full p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-medium text-center animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        {proofResult && (
          <div className="mt-8 w-full text-left animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <p className="text-[10px] text-zinc-500 mb-2 font-medium uppercase tracking-widest pl-1">Public Proof</p>
            <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/20 font-mono text-xs break-all shadow-inner text-emerald-400 max-h-32 overflow-y-auto">
              {JSON.stringify(proofResult.publicSignals, null, 2)}
            </div>
            <div className="mt-3 flex items-center justify-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <ShieldCheck size={12} className="text-emerald-500" />
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide">Birth year cryptographically hidden.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
