import { Link } from 'react-router-dom';
import { useAppStore, type Gig } from '../store/app';
function GigCard({ gig }: { gig: Gig }) {
  return (
    <Link to={`/gigs/${gig.id}`} className="pixel-card p-4 block hover:bg-red-900/20 transition-colors">
      <h3 className="font-bold text-red-500 truncate">{gig.title}</h3>
      <p className="text-sm opacity-70 line-clamp-2 mt-1">{gig.desc}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {gig.skills.map(s => <span key={s} className="px-2 py-0.5 text-xs bg-red-900 border border-red-500 rounded">{s}</span>)}
      </div>
      <div className="flex justify-between items-center mt-3 text-xs opacity-70">
        <span>Budget: {gig.budget} {gig.token ? 'TOKEN' : 'AVAX'}</span>
        <span>{gig.milestones.length} Milestones</span>
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
        <div className="text-center py-16 opacity-60">No gigs posted yet.</div>
      )}
    </div>
  );
}
