
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Shift, Project, Site, Team } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Clock, AlertCircle, ChevronRight, Activity } from 'lucide-react';

export const TeamsDashboardScreen: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const [sh, pr, si, te] = await Promise.all([
        api.shifts.getByDate(today),
        api.projects.getAll(),
        api.projects.getSites(),
        api.teams.getAll()
      ]);
      setShifts(sh);
      setProjects(pr);
      setSites(si);
      setTeams(te);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Syncing tactical operations...</div>;

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';
  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time Personnel & Site Tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Crews', value: shifts.filter(s => s.status === 'active').length, icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Headcount', value: shifts.reduce((acc, s) => acc + (s.headcountActual || s.headcountPlanned), 0), icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Missing Check-ins', value: shifts.filter(s => s.status === 'planned').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Open Blockers', value: 0, icon: AlertCircle, color: 'text-red-600 bg-red-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Active Operations Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Site</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Staffing</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {shifts.map(s => (
                <tr 
                  key={s.id} 
                  className="hover:bg-emerald-50/20 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/app/teams/shifts/${s.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{getTeamName(s.teamId)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} className="text-emerald-500" />
                      {getSiteName(s.siteId)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      s.status === 'planned' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <Users size={14} className="text-gray-400" />
                      {s.headcountActual || s.headcountPlanned}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Clock size={14} className="text-gray-300" />
                      {s.actualStart ? `Started: ${s.actualStart}` : `Target: ${s.plannedStart}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
