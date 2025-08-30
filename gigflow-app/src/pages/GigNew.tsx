import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/app';

export default function GigNew() {
  const navigate = useNavigate();
  const { addGig, session } = useAppStore();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState(0);
  const [token, setToken] = useState("");
  const [milestones, setMilestones] = useState([{ title: "Milestone 1", amount: 0 }]);

  const handleAddMilestone = () => setMilestones([...milestones, { title: `Milestone ${milestones.length + 1}`, amount: 0 }]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!session.address) return alert("Please sign in first.");
    const gigId = crypto.randomUUID();
    addGig({
      id: gigId,
      title, desc,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      budget, token: token || undefined,
      milestones,
      owner: session.address,
      status: "Open",
      applicants: [],
    });
    navigate(`/gigs/${gigId}`);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold">Create a New Gig</h2>
      <div className="pixel-card p-6 space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Gig Title" required />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded h-24" placeholder="Detailed Description" required />
        <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Skills (comma-separated, e.g., Solidity, React)" />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Total Budget" required />
          <input value={token} onChange={(e) => setToken(e.target.value)} className="bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Token Address (or leave for AVAX)" />
        </div>
      </div>

      <div className="pixel-card p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-accent-blue">Milestones</h3>
          <button type="button" onClick={handleAddMilestone} className="text-sm border border-accent-blue px-3 py-1 rounded hover:bg-accent-blue">Add</button>
        </div>
        {milestones.map((ms, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-center">
            <input value={ms.title} onChange={(e) => setMilestones(milestones.map((m, idx) => (idx === i ? { ...m, title: e.target.value } : m)))} className="col-span-2 bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" required />
            <input type="number" value={ms.amount} onChange={(e) => setMilestones(milestones.map((m, idx) => (idx === i ? { ...m, amount: Number(e.target.value) } : m)))} className="bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" required />
          </div>
        ))}
      </div>
     <button type="submit" className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold text-white">Publish Gig</button>

    </form>
  );
}
