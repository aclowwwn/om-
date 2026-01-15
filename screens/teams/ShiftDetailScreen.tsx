
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Shift, Site, Team, ShiftTask, ShiftUpdate } from '../../types';
import { 
  ArrowLeft, 
  Play, 
  LogOut, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  Users, 
  MapPin, 
  Clock 
} from 'lucide-react';

export const ShiftDetailScreen: React.FC = () => {
  const { shiftId } = useParams();
  const navigate = useNavigate();
  const [shift, setShift] = useState<Shift | null>(null);
  const [tasks, setTasks] = useState<ShiftTask[]>([]);
  const [updates, setUpdates] = useState<ShiftUpdate[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!shiftId) return;
      const sh = await api.shifts.getById(shiftId);
      if (sh) {
        setShift(sh);
        const [tk, up, te, si] = await Promise.all([
          api.shifts.getTasks(shiftId),
          api.shifts.getUpdates(shiftId),
          api.teams.getById(sh.teamId),
          api.projects.getSite(sh.siteId)
        ]);
        setTasks(tk);
        setUpdates(up);
        setTeam(te || null);
        setSite(si || null);
      }
      setLoading(false);
    };
    fetchData();
  }, [shiftId]);

  const handleCheckIn = async () => {
    if (!shiftId) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await api.shifts.update(shiftId, { actualStart: now, status: 'active' });
    await api.shifts.addUpdate({ shiftId, type: 'checkin', message: 'Team arrived on site.' });
    window.location.reload();
  };

  const toggleTaskStatus = async (taskId: string, current: string) => {
    const next = current === 'done' ? 'todo' : 'done';
    await api.shifts.updateTaskStatus(taskId, next as any);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: next as any } : t));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Retrieving operational data...</div>;
  if (!shift) return <div className="p-8 text-center text-red-500 font-bold">Shift not found.</div>;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border rounded-lg">
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Shift Control</h1>
          <p className="text-xs text-gray-500 mt-1">{shift.date}</p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight italic">{team?.name}</h2>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">Status: {shift.status}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg"><MapPin size={18} /></div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Location</p>
              <p className="text-sm font-bold">{site?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg"><Users size={18} /></div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Staffing</p>
              <p className="text-sm font-bold">{shift.headcountActual || shift.headcountPlanned} Active</p>
            </div>
          </div>
        </div>

        {!shift.actualStart ? (
          <button 
            onClick={handleCheckIn}
            className="w-full py-4 bg-emerald-500 text-slate-900 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all"
          >
            <Play size={20} fill="currentColor" /> Initialize Site Check-In
          </button>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <Clock size={18} className="text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">Shift active since {shift.actualStart}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest px-2">Assigned Tasks</h3>
        <div className="space-y-2">
          {tasks.map(t => (
            <button 
              key={t.id}
              onClick={() => toggleTaskStatus(t.id, t.status)}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                t.status === 'done' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  t.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'
                }`}>
                  {t.status === 'done' && <CheckCircle size={14} />}
                </div>
                <span className={`text-sm font-bold ${t.status === 'done' ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>{t.title}</span>
              </div>
              {t.status === 'blocked' && <AlertTriangle size={16} className="text-red-500" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest px-2">Operational Feed</h3>
        <div className="space-y-4 border-l-2 border-emerald-100 ml-4 pl-6 relative">
          {updates.map(u => (
            <div key={u.id} className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{u.type}</span>
                  <span className="text-[10px] text-gray-400">{new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{u.message}</p>
              </div>
            </div>
          ))}
          <button className="w-full p-4 border-2 border-dashed rounded-2xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
            <MessageSquare size={18} /> Add Progress Update
          </button>
        </div>
      </div>

      {shift.status === 'active' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
          <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-2xl flex items-center justify-center gap-2">
            <LogOut size={20} /> Checkout & Close Shift
          </button>
        </div>
      )}
    </div>
  );
};
