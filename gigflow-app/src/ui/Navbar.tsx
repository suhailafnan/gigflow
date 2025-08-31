import { Link } from 'react-router-dom';
import WalletConnectButton from './WalletConnectButton';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-red-500">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
        {/* Left Side: Logo */}
        <Link to="/" className="font-black text-xl text-red-500">GigFlow</Link>

        {/* Right Side: Group navigation links and the button together */}
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm items-center">
            <Link to="/gigs">Gigs</Link>
            <Link to="/gigs/new" className="text-red-500">Post Gig</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/auth" className="px-3 py-1 border border-red-500 rounded hover:bg-red-500">Start</Link>
                  <WalletConnectButton />
          </nav>
          
          {/* WalletConnectButton is now part of the right-side group */}
    
        </div>
      </div>
    </header>
  );
}
