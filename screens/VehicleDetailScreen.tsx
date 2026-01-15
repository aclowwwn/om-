
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Vehicle, TelemetryEvent, Alert, WorkOrder } from '../types';
import { VehicleStatusChip, HealthScoreBadge, MaintenanceDueBadge, AlertStatusBadge, SeverityBadge } from '../components/StatusBadges';
import { 
  ArrowLeft, 
  Activity, 
  Wrench, 
  AlertCircle,
  Clock,
  MapPin,
  TrendingUp,
  Battery,
  Thermometer,
  Zap,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'overview' | 'telemetry' | 'maintenance' | 'alerts';

export const VehicleDetailScreen: React.FC = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!vehicleId) return;
    const v = await api.fleet.getVehicle(vehicleId);
    if (v) {
      setVehicle(v);
      const [t, a, w] = await Promise.all([
        api.fleet.getTelemetry(vehicleId),
        api.alerts.getAlerts(),
        api.maintenance.getWorkOrders(vehicleId)
      ]);
      setTelemetry(t);
      setAlerts(a.filter(al => al.vehicleId === vehicleId));
      setWorkOrders(w);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  if (loading || !vehicle) return <div className="p-8 text-center text-gray-500">Retrieving unit telematics...</div>;

  const chartData = [...telemetry].reverse().map(t => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    speed: t.speedKph,
    temp: t.metrics.coolantTempC
  }));

  const handleAckAlert = async (id: string) => {
    await api.alerts.updateStatus(id, 'acked');
    fetchData();
  };

  const handleViewOnMap = () => {
    if (vehicle) {
      navigate(`/app/map?focus=${vehicle.id}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/app/fleet" className="p-2 hover:bg-gray-100 rounded-lg bg-white border border-gray-200">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{vehicle.assetCode}</h1>
            <p className="text-sm text-gray-500 font-medium">{vehicle.make} {vehicle.model} • Production Year {vehicle.year}</p>
          </div>
        </div>
        <button 
          onClick={handleViewOnMap}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700 shadow-sm transition-all"
        >
          <MapPin size={18} className="text-amber-500" />
          View on Map
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: 'Health Score', value: <HealthScoreBadge score={vehicle.healthScore} />, color: 'text-amber-600 bg-amber-50' },
          { icon: Clock, label: 'Engine Hours', value: vehicle.engineHours || '-', color: 'text-gray-600 bg-gray-50' },
          { icon: MapPin, label: 'Status', value: <VehicleStatusChip status={vehicle.status} />, color: 'text-gray-600 bg-gray-50' },
          { icon: Wrench, label: 'Cycle Status', value: <MaintenanceDueBadge state={vehicle.maintenance.dueState} />, color: 'text-gray-600 bg-gray-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-200">
          {(['overview', 'telemetry', 'maintenance', 'alerts'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab 
                  ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50/30' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <h3 className="text-sm font-bold text-gray-700 mb-6 flex items-center gap-2">
                    <TrendingUp size={16} className="text-amber-500" /> 
                    24h Performance Telematics
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="time" fontSize={10} minTickGap={40} />
                        <YAxis fontSize={10} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                        <Line type="monotone" dataKey="speed" stroke="#f59e0b" strokeWidth={3} dot={false} name="Speed (km/h)" />
                        <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={false} name="Coolant (°C)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 bg-amber-50/30 rounded-xl">
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Sync Time</h4>
                    <p className="text-sm font-semibold text-gray-900">{new Date(vehicle.lastUpdate).toLocaleString()}</p>
                  </div>
                  <div className="p-4 border border-gray-200 bg-gray-50 rounded-xl">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Battery</h4>
                    <p className="text-sm font-semibold text-gray-900">{telemetry[0]?.metrics.batteryV}V - Nominal</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-xl shadow-sm">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Risk Diagnosis</h3>
                  <div className="space-y-4">
                    {vehicle.healthScore < 40 ? (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs leading-relaxed font-medium">
                        <AlertCircle size={20} className="mb-2" />
                        Critical drive-train anomaly. Maintenance required within 48h.
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs leading-relaxed font-medium">
                        <Activity size={20} className="mb-2" />
                        System nominal. Optimized cycle efficiency.
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Location Snapshot</h3>
                  <div className="aspect-video bg-white rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
                    {vehicle.lastLocation.lat.toFixed(4)}, {vehicle.lastLocation.lon.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Master Feed</h3>
               <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                 {telemetry.map(t => (
                   <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-6">
                       <div className="text-xs text-gray-400 font-medium">{new Date(t.timestamp).toLocaleTimeString()}</div>
                       <div className="flex items-center gap-4">
                         <Zap size={14} className={t.ignitionOn ? 'text-green-500' : 'text-gray-300'} />
                         <span className="text-sm font-bold">{t.speedKph} KM/H</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-6">
                       <span className="text-xs font-medium text-gray-500 uppercase"><Thermometer size={14} className="inline mr-1" /> {t.metrics.coolantTempC.toFixed(1)}°C</span>
                       <span className="text-xs font-medium text-gray-500 uppercase"><Battery size={14} className="inline mr-1" /> {t.metrics.batteryV.toFixed(1)}V</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Service Log</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-lg hover:bg-amber-600 transition-all shadow-sm">
                  <Plus size={16} /> New Entry
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workOrders.map(wo => (
                  <div key={wo.id} className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-amber-800">{wo.category}</div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        wo.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                      }`}>{wo.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{wo.description}</h4>
                    <div className="pt-3 border-t flex justify-between items-center text-xs font-bold text-gray-400">
                      <span>{new Date(wo.createdAt).toLocaleDateString()}</span>
                      <span className="text-gray-900">${wo.costEstimate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                   No active alerts for this unit.
                </div>
              ) : (
                alerts.map(a => (
                  <div key={a.id} className="p-5 border border-gray-200 rounded-2xl flex items-start gap-4">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      a.severity === 'high' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <AlertCircle size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 tracking-tight">{a.title}</h4>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={a.severity} />
                          <AlertStatusBadge status={a.status} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{a.description}</p>
                      {a.status === 'open' && (
                        <button 
                          onClick={() => handleAckAlert(a.id)}
                          className="px-4 py-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-lg hover:bg-amber-600"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
