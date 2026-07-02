import WalletConnect from "@/components/WalletConnect";
import AgeVerifier from "@/components/AgeVerifier";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 w-full max-w-4xl">
        <h1 className="text-5xl font-bold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
          Cardano AnonPass
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-xl mb-6">
          Connect your Lace wallet to securely verify your credentials without revealing sensitive data on-chain.
        </p>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          <WalletConnect />
          <AgeVerifier />
        </div>
      </main>
    </div>
  );
}

