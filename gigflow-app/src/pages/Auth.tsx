import 'viem/window'; // <-- THE FIX IS HERE
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/app';
import { createLocalWallet } from '../lib/wallet';

export default function Auth() {
  const navigate = useNavigate();
  const { setSession } = useAppStore();

  const handleConnectWallet = async () => {
    // No more 'as any' needed. TypeScript now understands window.ethereum.
    const eth = window.ethereum;

    if (!eth) return alert("Please install a wallet like MetaMask.");

    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
     setSession({ auth: "wallet", address: accounts[0] });
      navigate("/profile");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleEmailFlow = () => {
    const wallet = createLocalWallet();
    localStorage.setItem("gigflow_local_wallet", JSON.stringify(wallet));
    setSession({ auth: "email", address: wallet.address, userId: wallet.address });
    navigate("/profile");
  };

  return (
    <div className="max-w-md mx-auto space-y-8 mt-16">
      <h2 className="text-3xl font-bold text-center">Join GigFlow</h2>
      <div className="pixel-card p-6 space-y-4">
        <button onClick={handleConnectWallet} className="w-full px-4 py-3 bg-red-600 rounded hover:bg-red-500 font-semibold">
          Connect Wallet
        </button>
        <div className="text-center opacity-60">or</div>
        <button onClick={handleEmailFlow} className="w-full px-4 py-3 border border-red-500 rounded hover:bg-red-900 font-semibold">
          Continue with Email
        </button>
        <p className="text-xs opacity-60 text-center pt-2">
          Email sign-in creates a temporary, browser-based wallet.
        </p>
      </div>
    </div>
  );
}
