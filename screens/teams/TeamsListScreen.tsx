
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Team } from '../../types';
import { Users, User, ShieldCheck, Plus } from 'lucide-react';

export const TeamsListScreen: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.teams.getAll().then(t => {
      setTeams(t);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Syncing crew directory...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Teams & Personnel</h1>
          <p className="text-sm text-gray-500">Active Duty Units</p>
        </div>
        <button className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2">
          <Plus size={18} /> Add Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-none mb-1">{team.name}</h3>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">ID: {team.id}</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Leader</p>
                    <p className="text-sm font-bold text-gray-700">{team.leaderName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Standard Crew Size</p>
                    <p className="text-sm font-bold text-gray-700">{team.defaultHeadcount} Personnel</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-50 flex gap-2">
                <button className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-lg transition-colors">Edit Profile</button>
                <button className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg transition-colors">History</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
