
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Vehicle, WorkOrder } from '../types';
import { HealthScoreBadge, MaintenanceDueBadge } from '../components/StatusBadges';
import { useNavigate } from 'react-router-dom';
import { Hammer, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

export const MaintenanceQueueScreen: React.FC = () => {
  const [queue, setQueue] = useState<{
    overdue: Vehicle[];
    dueSoon: Vehicle[];
    highRisk: Vehicle[];
    openWorkOrders: WorkOrder[];
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.maintenance.getQueue().then(setQueue);
  }, []);

  if (!queue) return <div className="p-8 text-center text-gray-500 font-medium">Analyzing queue priority...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Priority Queue</h1>
        <p className="text-sm text-gray-500">Intelligent Maintenance Sequencing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest px-2">
            <ShieldAlert size={18} />
            <h2>High Risk Matrix</h2>
          </div>
          <div className="space-y-3">
            {[...queue.highRisk, ...queue.overdue].slice(0, 5).map((v, idx) => (
              <div 
                key={`${v.id}-${idx}`}
                onClick={() => navigate(`/app/vehicle/${v.id}`)}
                className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${v.healthScore < 40 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                    {v.healthScore < 40 ? <AlertTriangle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{v.assetCode}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase">{v.type.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HealthScoreBadge score={v.healthScore} />
                  <MaintenanceDueBadge state={v.maintenance.dueState} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest px-2">
            <Hammer size={18} />
            <h2>Active Repairs</h2>
          </div>
          <div className="space-y-3">
            {queue.openWorkOrders.map(wo => (
              <div 
                key={wo.id}
                onClick={() => navigate(`/app/vehicle/${wo.vehicleId}`)}
                className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                   <div className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">{wo.category}</div>
                   <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-gray-100 text-gray-600">{wo.status}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{wo.description}</h3>
                <div className="flex justify-between items-center mt-4 text-[10px] font-bold text-gray-400">
                  <span>Entry: {new Date(wo.createdAt).toLocaleDateString()}</span>
                  <span className="text-gray-900">${wo.costEstimate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest px-2 mb-4">
          <Clock size={18} />
          <h2>Projected Requirements (7D Window)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {queue.dueSoon.map(v => (
            <div 
              key={v.id}
              onClick={() => navigate(`/app/vehicle/${v.id}`)}
              className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900 tracking-tight">{v.assetCode}</span>
                <span className="text-[10px] font-bold text-gray-400">{v.maintenance.nextDueAt ? new Date(v.maintenance.nextDueAt).toLocaleDateString() : 'TBD'}</span>
              </div>
              <div className="text-[10px] font-medium text-gray-400 mb-4">{v.make} {v.model}</div>
              <MaintenanceDueBadge state="due_soon" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
