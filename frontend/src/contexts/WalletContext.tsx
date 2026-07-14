"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ConnectedSession } from '../lib/midnight';

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  walletType: 'lace' | null;
  isConnecting: boolean;
  walletStatus: 'checking' | 'detected' | 'not-found';
  session: ConnectedSession | null;
  connect: (network?: string) => Promise<ConnectedSession | undefined>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState<'lace' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletStatus, setWalletStatus] = useState<'checking' | 'detected' | 'not-found'>('checking');
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const connectingRef = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      const injected = (window as any).midnight;
      if (injected) {
        const wallets = Object.values(injected);
        const lace = wallets.find((w: any) => w.name?.toLowerCase().includes('lace')) || wallets[0];
        if (lace) {
          setWalletType('lace');
          setWalletStatus('detected');
          clearInterval(id);
          return;
        }
      }
      if (Date.now() - startedAt >= 6000) { setWalletStatus('not-found'); clearInterval(id); }
    }, 300);
    return () => clearInterval(id);
  }, []);

  const connect = useCallback(async (network = 'preprod') => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    setIsConnecting(true);
    try {
      const injected = (window as any).midnight;
      if (!injected) throw new Error('No Midnight wallets found');
      
      const wallets = Object.values(injected);
      const wallet = wallets.find((w: any) => w.name?.toLowerCase().includes('lace')) || wallets[0];
      
      if (!wallet) throw new Error('Lace wallet not found');
      
      // Import dapp-connector-api so that types are correctly loaded (if used elsewhere)
      await import('@midnight-ntwrk/dapp-connector-api');

      const api = await wallet.connect(network);
      const { createConnectedSession } = await import('../lib/midnight');
      const sess = await createConnectedSession(api);
      
      setSession(sess);
      setAddress(sess.unshieldedAddress);
      setIsConnected(true);
      return sess;
    } catch (err: any) {
      console.warn('Wallet connection failed:', err.message);
      alert(err.message || 'Failed to connect wallet');
      setIsConnecting(false);
      connectingRef.current = false;
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null); setIsConnected(false); setSession(null);
    setWalletStatus('checking'); setWalletType(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnected, walletType, isConnecting, walletStatus, session, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
