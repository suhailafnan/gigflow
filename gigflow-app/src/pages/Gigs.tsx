import { Link } from 'react-router-dom';
// FIX 1: Import the correct type name 'GigListing' instead of 'Gig'
import { useAppStore, type GigListing } from '../store/app';

function GigCard({ gig }: { gig: GigListing }) {
  return (
    <Link to={`/gigs/${gig.id}`} className="pixel-card p-4 block hover:bg-red-900/20 transition-colors">
      <h3 className="font-bold text-red-500 truncate">{gig.title}</h3>
      {/* Use the 'description' property which exists on the type */}
      <p className="text-sm opacity-70 line-clamp-2 mt-1">{gig.description || 'No description available.'}</p>
      
      {/* FIX 2: Explicitly type the parameter 's' as a string */}
      <div className="flex flex-wrap gap-1 mt-3">
        {gig.skills?.map((s: string) => (
          <span key={s} className="px-2 py-0.5 text-xs bg-red-900 border border-red-500 rounded">{s}</span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-3 text-xs opacity-70">
        <span>Budget: {gig.budget} {gig.token && gig.token !== 'AVAX' ? 'TOKEN' : 'AVAX'}</span>
        {/* Add optional chaining to safely access length */}
        <span>{gig.milestones?.length || 0} Milestones</span>
      </div>
    </Link>
  );
}

export default function Gigs() {
  const { gigs } = useAppStore();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Available Gigs</h2>
        <Link to="/gigs/new" className="px-4 py-2 border border-red-500 rounded hover:bg-red-500 font-semibold">Post a Gig</Link>
      </div>
      
      {gigs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gigs.map(g => <GigCard key={g.id} gig={g} />)}
        </div>
      ) : (
        <div className="text-center py-16 opacity-60">No gigs have been posted yet.</div>
      )}
    </div>
  );
}
