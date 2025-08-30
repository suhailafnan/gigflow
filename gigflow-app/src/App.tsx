import { Routes, Route } from 'react-router-dom';
import Navbar from './ui/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Gigs from './pages/Gigs';
import GigNew from './pages/GigNew';
import GigDetail from './pages/GigDetail';

export default function App() {
  return (
    // FIX APPLIED HERE: Added bg-black and text-white for a global dark theme.
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/new" element={<GigNew />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
        </Routes>
      </main>
    </div>
  );
}
