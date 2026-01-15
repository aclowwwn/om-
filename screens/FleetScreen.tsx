
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Vehicle } from '../types';
import { VehicleStatusChip, HealthScoreBadge, MaintenanceDueBadge } from '../components/StatusBadges';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, Search, MapPin } from 'lucide-react';

export const FleetScreen: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.fleet.getVehicles().then(setVehicles);
  }, []);

  const filtered = vehicles.filter(v => 
    v.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOnMap = (e: React.MouseEvent, vehicleId: string) => {
    e.stopPropagation();
    navigate(`/app/map?focus=${vehicleId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Global Assets</h1>
          <p className="text-sm text-gray-500">Fleet Inventory Matrix: {vehicles.length} Units</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Health</th>
                <th className="px-6 py-4">Maint. Cycle</th>
                <th className="px-6 py-4 text-center">Alerts</th>
                <th className="px-6 py-4">Last Sync</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map(v => (
                <tr 
                  key={v.id} 
                  className="hover:bg-amber-50/30 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/app/vehicle/${v.id}`)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-gray-900">{v.assetCode}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{v.plate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600 font-medium">{v.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4"><VehicleStatusChip status={v.status} /></td>
                  <td className="px-6 py-4"><HealthScoreBadge score={v.healthScore} /></td>
                  <td className="px-6 py-4"><MaintenanceDueBadge state={v.maintenance.dueState} /></td>
                  <td className="px-6 py-4 text-center">
                    {v.openAlertsCount > 0 ? (
                      <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {v.openAlertsCount}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                    {new Date(v.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleViewOnMap(e, v.id)}
                        className="p-1.5 rounded-lg hover:bg-amber-100 text-gray-400 hover:text-amber-600 transition-colors"
                        title="View on Map"
                      >
                        <MapPin size={18} />
                      </button>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500" />
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
