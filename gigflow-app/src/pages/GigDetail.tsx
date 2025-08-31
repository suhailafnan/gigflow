// src/pages/GigDetail.tsx

import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/app';
import { useGigFlowCore } from '../hooks/useContracts'; // Import the contract hook

export default function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const { gigs, session, updateGig, addNotification } = useAppStore();
  const { assignGig } = useGigFlowCore(); // Get the assignGig function

  // FIX: Convert the URL parameter 'id' (string) to a number for correct matching
  const gigId = id ? parseInt(id, 10) : undefined;
  const gig = gigs.find((g) => g.id === gigId);

  if (!gig) {
    return <div className="text-center py-16">Gig not found.</div>;
  }

  // These properties are now correctly defined in the GigListing type
  const isOwner = session.address === gig.owner;
  const hasApplied = gig.applicants.includes(session.address || '');

  // This should ideally also be a contract call
  const handleApply = () => {
    if (!session.address) return alert("Sign in to apply.");
    if (hasApplied) return;
    updateGig(gig.id, { applicants: [...gig.applicants, session.address] });
    addNotification({
      id: crypto.randomUUID(),
      type: "Apply",
      gigId: gig.id, // This is now correctly a number
      from: session.address,
      createdAt: Date.now(),
      read: false,
      title: 'New Application',
      message: `A new user applied to your gig "${gig.title}"`,
    });
  };

  // FIX: handleAccept now calls the smart contract via the hook
  const handleAccept = async (applicantAddress: string) => {
    if (!isOwner) return;
    try {
      await assignGig(gig.id, applicantAddress);
      updateGig(gig.id, { assignee: applicantAddress, status: "Assigned" });
      addNotification({
        id: crypto.randomUUID(),
        type: "Accept",
        gigId: gig.id, // Correctly a number
        from: session.address!,
        createdAt: Date.now(),
        read: false,
        title: 'Gig Assigned',
        message: `You assigned your gig to ${applicantAddress.slice(0, 6)}...`
      });
    } catch (error) {
      console.error("Failed to assign gig:", error);
      alert("An error occurred while assigning the gig. Please check the console.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="pixel-card p-6">
        <h2 className="text-3xl font-bold text-accent-blue mb-2">{gig.title}</h2>
        {/* Use the correct 'description' property */}
        <p className="opacity-80">{gig.description || 'No description provided.'}</p>
        <div className="flex justify-between items-center mt-4 text-sm opacity-70">
          <span>Owner: {gig.owner.substring(0, 6)}...{gig.owner.substring(38)}</span>
          <span>Status: {gig.status}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="pixel-card p-6">
            <h3 className="font-bold text-accent-blue mb-3">Milestones</h3>
            {/* FIX: Check if milestones exist before mapping */}
            {gig.milestones && gig.milestones.length > 0 ? (
              <ul className="space-y-2">
                {gig.milestones.map((ms, i) => (
                  <li key={i} className="flex justify-between items-center p-2 border border-blue-900 rounded">
                    <span>{i + 1}. {ms.title}</span>
                    <span className="font-semibold">{ms.amount} {gig.token ? 'TOKEN' : 'AVAX'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs opacity-60">No milestones defined.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="pixel-card p-6">
            <h3 className="font-bold text-accent-blue mb-3">Actions</h3>
            {isOwner && gig.status === "Open" && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Applicants ({gig.applicants.length})</h4>
                {gig.applicants.length > 0 ? (
                  <ul className="space-y-1">
                    {gig.applicants.map((addr: string) => ( // Explicitly type addr
                      <li key={addr} className="flex justify-between items-center text-sm">
                        <span>{addr.substring(0, 6)}...</span>
                        <button onClick={() => handleAccept(addr)} className="text-xs px-2 py-1 border border-accent-blue rounded hover:bg-accent-blue">Accept</button>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-xs opacity-60">No applicants yet.</p>}
              </div>
            )}
            {!isOwner && gig.status === "Open" && (
              <button onClick={handleApply} disabled={hasApplied} className="w-full px-4 py-2 border border-accent-blue rounded disabled:opacity-50">
                {hasApplied ? "Application Sent" : "Apply for this Gig"}
              </button>
            )}
            {gig.status === "Assigned" && (
              <p className="text-sm opacity-70">Assigned to: {gig.assignee?.substring(0, 6)}...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
