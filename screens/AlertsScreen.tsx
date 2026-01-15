
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Alert, Vehicle } from '../types';
import { AlertStatusBadge, SeverityBadge } from '../components/StatusBadges';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react';

export const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    const [alertList, vehicleList] = await Promise.all([
      api.alerts.getAlerts(),
      api.fleet.getVehicles()
    ]);
    setAlerts(alertList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    
    const vMap: Record<string, Vehicle> = {};
    vehicleList.forEach(v => vMap[v.id] = v);
    setVehicles(vMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleStatusUpdate = async (id: string, status: Alert['status']) => {
    await api.alerts.updateStatus(id, status);
    fetchAlerts();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Syncing alert protocols...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Active Warning Inbox</h1>
          <p className="text-sm text-gray-500 font-medium">Unified Operations Monitoring</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-[10px] font-bold uppercase tracking-widest shadow-sm">Bulk Clear</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Event Description</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-center">Protocol Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {alerts.map(a => (
                <tr key={a.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="px-6 py-4"><SeverityBadge severity={a.severity} /></td>
                  <td className="px-6 py-4">
                    <div 
                      onClick={() => navigate(`/app/vehicle/${a.vehicleId}`)}
                      className="font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                    >
                      {vehicles[a.vehicleId]?.assetCode || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{a.title}</div>
                    <div className="text-[10px] text-gray-400 font-medium truncate max-w-xs">{a.description}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                    {new Date(a.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short', hour12: false })}
                  </td>
                  <td className="px-6 py-4 text-center"><AlertStatusBadge status={a.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {a.status === 'open' && (
                        <button 
                          onClick={() => handleStatusUpdate(a.id, 'acked')}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Acknowledge"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {a.status !== 'closed' && (
                        <button 
                          onClick={() => handleStatusUpdate(a.id, 'closed')}
                          className="p-1.5 text-gray-300 hover:bg-gray-50 rounded-lg transition-all"
                          title="Close"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button 
                         onClick={() => navigate(`/app/vehicle/${a.vehicleId}`)}
                         className="p-1.5 text-gray-300 hover:bg-gray-50 rounded-lg transition-all"
                         title="View Asset"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
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
