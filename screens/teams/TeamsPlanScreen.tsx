
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Project, Site, Team, Shift } from '../../types';
import { Calendar, Plus, Save, Clock, MapPin, Users } from 'lucide-react';

export const TeamsPlanScreen: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    plannedStart: '06:00',
    plannedEnd: '14:00',
    headcountPlanned: 8
  });

  const fetchData = async () => {
    const [sh, pr, si, te] = await Promise.all([
      api.shifts.getByDate(date),
      api.projects.getAll(),
      api.projects.getSites(),
      api.teams.getAll()
    ]);
    setShifts(sh);
    setProjects(pr);
    setSites(si);
    setTeams(te);
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleCreateShift = async () => {
    if (!newShift.projectId || !newShift.siteId || !newShift.teamId) return;
    await api.shifts.create({ ...newShift, date });
    setIsAdding(false);
    fetchData();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tactical Dispatch</h1>
          <p className="text-sm text-gray-500">Resource Assignment Board</p>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white shadow-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Shift
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shifts.map(s => {
          const team = teams.find(t => t.id === s.teamId);
          const site = sites.find(st => st.id === s.siteId);
          return (
            <div key={s.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{team?.name}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{team?.leaderName}</p>
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase text-gray-500">
                  {s.status}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Site</p>
                    <p className="text-sm font-bold text-gray-700">{site?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Window</p>
                    <p className="text-sm font-bold text-gray-700">{s.plannedStart} - {s.plannedEnd}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {shifts.length === 0 && !isAdding && (
          <div className="lg:col-span-2 py-20 bg-gray-50 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-gray-400">
            <Calendar size={48} className="mb-4 opacity-20" />
            <p className="font-bold">No missions dispatched for this date.</p>
          </div>
        )}

        {isAdding && (
          <div className="bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Configure Tactical Shift</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project</label>
                  <select 
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-sm outline-none"
                    onChange={(e) => setNewShift({ ...newShift, projectId: e.target.value })}
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Site</label>
                  <select 
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-sm outline-none"
                    onChange={(e) => setNewShift({ ...newShift, siteId: e.target.value })}
                  >
                    <option value="">Select Site</option>
                    {sites.filter(s => s.projectId === newShift.projectId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Team</label>
                <select 
                  className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-sm outline-none"
                  onChange={(e) => {
                    const t = teams.find(team => team.id === e.target.value);
                    setNewShift({ ...newShift, teamId: e.target.value, headcountPlanned: t?.defaultHeadcount });
                  }}
                >
                  <option value="">Select Team</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Planned Start</label>
                  <input 
                    type="time" 
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-sm outline-none"
                    value={newShift.plannedStart}
                    onChange={(e) => setNewShift({ ...newShift, plannedStart: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Headcount</label>
                  <input 
                    type="number" 
                    className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-sm outline-none"
                    value={newShift.headcountPlanned}
                    onChange={(e) => setNewShift({ ...newShift, headcountPlanned: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateShift}
                className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Save size={18} /> Deploy Shift
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
