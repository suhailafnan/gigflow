import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useAppStore } from '../store/app';

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, status } = useConnect();
  const { disconnect } = useDisconnect();

  const setSession = useAppStore((state) => state.setSession);

  useEffect(() => {
    if (isConnected && address) {
      setSession({ auth: 'wallet', address, isConnected: true });
    } else {
      setSession({ auth: null, address: undefined, isConnected: false });
    }
  }, [isConnected, address, setSession]);

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        // FIX: Reduced padding and font size for a smaller button
        className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-500 text-white font-semibold"
      >
        Disconnect {address?.slice(0, 6)}...
      </button>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={status === 'pending'}
          key={connector.id}
          onClick={() => connect({ connector })}
          // FIX: Reduced padding and font size for a smaller button
          className="px-3 py-1 text-sm bg-green-600 rounded hover:bg-green-500 text-white font-semibold mr-2 disabled:opacity-50"
        >
          {status === 'pending' ? 'Connecting...' : `Connect`}
        </button>
      ))}
      {error && <div className="mt-2 text-xs text-red-400">Error: {error.message}</div>}
    </div>
  );
}
