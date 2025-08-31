import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/app';
import { useGigFlowCore } from '../hooks/useContracts'; // Import the contract hook

export default function GigNew() {
  const navigate = useNavigate();
  const { addGig, session } = useAppStore();
  const { postGig, isPending } = useGigFlowCore(); // Get the postGig function and loading state

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState(0);
  const [token, setToken] = useState(""); // Default to empty string for AVAX
  const [isConfidential, setIsConfidential] = useState(false);
  const [milestones, setMilestones] = useState([{ title: "Initial Milestone", amount: 0 }]);

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: `Milestone ${milestones.length + 1}`, amount: 0 }]);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!session.address) {
      alert("Please sign in first.");
      return;
    }

    try {
      // Prepare milestone amounts for the smart contract
      const milestoneAmounts = milestones.map(ms => ms.amount);
      
      // Use a placeholder for dataHash for now
      const dataHash = "0x...placeholder..."; 

      // Call the smart contract
      await postGig(
        title,
        dataHash,
        budget,
        token || "0x0000000000000000000000000000000000000000", // Use zero address for AVAX
        isConfidential,
        milestoneAmounts
      );

      // Create a temporary local representation of the gig
      // In a real app, you would listen for the contract event to get the real gig ID
      const tempGigId = Math.floor(Math.random() * 1000000);

      addGig({
        id: tempGigId,
        client: session.address,
        owner: session.address,
        title,
        description: desc,
        dataHash,
        budget,
        token: token || "AVAX",
        isConfidential,
        createdAt: Date.now() / 1000,
        isActive: true,
        escrowContract: "0x...pending...",
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        milestones,
        status: "Open",
        applicants: [],
      });

      alert("Gig published successfully!");
      navigate(`/gigs/${tempGigId}`);

    } catch (error) {
      console.error("Failed to post gig:", error);
      alert("Failed to publish gig. Please check the console for details.");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold">Create a New Gig</h2>

      <div className="pixel-card p-6 space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Gig Title" required />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded h-24" placeholder="Detailed Description" required />
        <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Skills (comma-separated, e.g., Solidity, React)" />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" step="0.01" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Total Budget (AVAX)" required />
          <input value={token} onChange={(e) => setToken(e.target.value)} className="bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="ERC20 Token Address (or leave for AVAX)" />
        </div>
        <div className="flex items-center">
            <input type="checkbox" id="confidential" checked={isConfidential} onChange={(e) => setIsConfidential(e.target.checked)} className="mr-2" />
            <label htmlFor="confidential">Make this gig confidential</label>
        </div>
      </div>

      <div className="pixel-card p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-accent-blue">Milestones</h3>
          <button type="button" onClick={handleAddMilestone} className="text-sm border border-accent-blue px-3 py-1 rounded hover:bg-accent-blue">Add Milestone</button>
        </div>
        {milestones.map((ms, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-center">
            <input value={ms.title} onChange={(e) => setMilestones(milestones.map((m, idx) => (idx === i ? { ...m, title: e.target.value } : m)))} className="col-span-2 bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Milestone Description" required />
            <input type="number" step="0.01" value={ms.amount} onChange={(e) => setMilestones(milestones.map((m, idx) => (idx === i ? { ...m, amount: Number(e.target.value) } : m)))} className="bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Amount" required />
          </div>
        ))}
      </div>

      <button type="submit" disabled={isPending} className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold text-white disabled:opacity-50">
        {isPending ? 'Publishing...' : 'Publish Gig on Avalanche'}
      </button>
    </form>
  );
}
