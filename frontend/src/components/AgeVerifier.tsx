"use client";

import { useState } from "react";
import { generateAgeProof } from "../lib/zkp";

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
    <div className="flex flex-col items-center justify-center p-8 mt-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl bg-white dark:bg-zinc-900/50 backdrop-blur-md text-zinc-900 dark:text-zinc-100 w-full max-w-md mx-auto transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
        <h2 className="text-2xl font-bold tracking-tight">Age Verification (ZK)</h2>
      </div>
      <p className="text-sm text-zinc-500 mb-6 text-center">Prove you are over 18 without revealing your exact birth year.</p>

      <div className="w-full mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 pl-1">Birth Year (Private Input)</label>
        <input 
          type="number" 
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="e.g. 1995"
          className="w-full bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-center"
        />
      </div>

      <button
        onClick={handleProveAge}
        disabled={loading || !birthYear}
        className="px-6 py-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-semibold transition-all duration-200 w-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex justify-center items-center space-x-3 transform hover:-translate-y-0.5"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span>Generating Proof...</span>
          </>
        ) : (
          <span>Generate ZK Proof</span>
        )}
      </button>

      {error && (
        <div className="mt-6 w-full p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {proofResult && (
        <div className="mt-6 w-full text-left animate-in fade-in zoom-in duration-300">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-semibold uppercase tracking-wider pl-1">Public Signals (On-Chain Visible)</p>
          <div className="bg-zinc-100 dark:bg-zinc-950/80 p-4 rounded-2xl border border-emerald-500/30 font-mono text-xs break-all shadow-inner text-emerald-600 dark:text-emerald-400 max-h-32 overflow-y-auto">
            {JSON.stringify(proofResult.publicSignals, null, 2)}
          </div>
          <p className="mt-3 text-xs text-zinc-500 text-center font-medium bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">Notice your birth year is completely hidden from the output!</p>
        </div>
      )}
    </div>
  );
}
