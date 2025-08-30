import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppStore } from '../store/app';
import type { Work } from '../store/app';

export default function Profile() {
  const { session, profile, upsertProfile } = useAppStore();
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [skill, setSkill] = useState("");
  const [work, setWork] = useState<Work>({ title: '', url: '' });

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    upsertProfile({ name, bio });
  };

  const handleAddSkill = () => {
    if (!skill || profile.skills.includes(skill)) return;
    upsertProfile({ skills: [...profile.skills, skill] });
    setSkill("");
  };

  const handleAddWork = () => {
    if (!work.title || !work.url) return;
    upsertProfile({ works: [...profile.works, work] });
    setWork({ title: '', url: '' });
  };

  return (
    <div className="space-y-6">
      <div className="pixel-card p-6">
        <h2 className="font-bold text-accent-blue text-xl">My Profile</h2>
        <p className="text-sm opacity-70 mb-4">Address: {session.address || "Not connected"}</p>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Your Name" />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded h-24" placeholder="Short Bio" />
          <button type="submit" className="px-4 py-2 bg-accent-blue rounded hover:opacity-90">Save Profile</button>
        </form>
      </div>

      <div className="pixel-card p-6 space-y-3">
        <h3 className="font-bold text-accent-blue">Skills</h3>
        <div className="flex gap-2">
          <input value={skill} onChange={(e) => setSkill(e.target.value)} className="flex-1 bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Add a skill (e.g., Solidity)" />
          <button onClick={handleAddSkill} className="px-4 py-2 border border-accent-blue rounded hover:bg-accent-blue">Add</button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {profile.skills.map((s, i) => <span key={i} className="px-2 py-1 text-xs bg-blue-900/50 border border-accent-blue rounded">{s}</span>)}
        </div>
      </div>

      <div className="pixel-card p-6 space-y-3">
        <h3 className="font-bold text-accent-blue">Previous Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={work.title} onChange={(e) => setWork({ ...work, title: e.target.value })} className="md:col-span-1 bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="Project Title" />
          <input value={work.url} onChange={(e) => setWork({ ...work, url: e.target.value })} className="md:col-span-2 bg-black text-white placeholder-gray-400 border border-accent-blue p-2 rounded" placeholder="https://github.com/..." />
        </div>
        <button onClick={handleAddWork} className="px-4 py-2 border border-accent-blue rounded hover:bg-accent-blue">Add Work</button>
        <ul className="list-disc ml-6 space-y-1 pt-2">
          {profile.works.map((w, i) => (
            <li key={i}><a href={w.url} target="_blank" rel="noreferrer" className="text-accent-blue hover:underline">{w.title}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
