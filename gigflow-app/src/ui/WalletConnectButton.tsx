import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useAppStore } from '../store/app';

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  // FIX: Destructure 'status' instead of 'isLoading' and 'pendingConnector'
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
        className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white font-semibold"
      >
        Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          // FIX: Check if status is 'pending' to disable the button
          disabled={status === 'pending'}
          key={connector.id}
          onClick={() => connect({ connector })}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 text-white font-semibold mr-2 disabled:opacity-50"
        >
          {/* FIX: Show 'Connecting...' when the status is 'pending' */}
          {status === 'pending' ? 'Connecting...' : `Connect ${connector.name}`}
        </button>
      ))}
      {error && <div className="mt-2 text-red-400">Error: {error.message}</div>}
    </div>
  );
}
