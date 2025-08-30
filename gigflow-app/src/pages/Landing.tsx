import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    // FIX APPLIED HERE: Added bg-black and text-white to the main container
    <div className="space-y-12 bg-black text-white">
      <section className="text-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">Ship Work. Earn Reputation.</h1>
        <p className="opacity-80 max-w-xl mx-auto">A decentralized platform for milestone-based gigs, powered by smart contracts and soulbound reputation.</p>
        <div className="mt-8">
          <Link to="/auth" className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded font-semibold text-lg">Get Started</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="pixel-card p-6">
          <h3 className="font-bold text-red-500 text-xl mb-2">1. Create Gigs</h3>
          <p>Post gigs with clear milestones, deadlines, and budgets on-chain.</p>
        </div>
        <div className="pixel-card p-6">
          <h3 className="font-bold text-red-500 text-xl mb-2">2. Approve Work</h3>
          <p>Clients approve work and release funds milestone by milestone.</p>
        </div>
        <div className="pixel-card p-6">
          <h3 className="font-bold text-red-500 text-xl mb-2">3. Build Reputation</h3>
          <p>Mint non-transferable SBTs for completed gigs to build your on-chain resume.</p>
        </div>
      </section>
    </div>
  );
}
