
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { Vehicle } from '../types';
import { VehicleStatusChip, HealthScoreBadge, MaintenanceDueBadge } from '../components/StatusBadges';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, RefreshCcw } from 'lucide-react';

// Marker icons with pulsating effect
const createIcon = (color: string, pulsate = true) => L.divIcon({
  html: `
    <div style="position: relative; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">
      ${pulsate ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${color}; opacity: 0.6; animation: marker-pulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;"></div>` : ''}
      <div style="position: relative; background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3); z-index: 10;"></div>
    </div>
  `,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -7]
});

const icons = {
  active: createIcon('#f59e0b'), // Amber-500
  idle: createIcon('#fbbf24'),   // Amber-400
  offline: createIcon('#94a3b8', false), // No pulse for offline
  risky: createIcon('#ef4444')   // Red-500
};

// Sub-component to handle programmatic map movements
const MapFocusHandler: React.FC<{ vehicles: Vehicle[], focusId: string | null }> = ({ vehicles, focusId }) => {
  const map = useMap();

  useEffect(() => {
    if (focusId && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.id === focusId);
      if (vehicle) {
        map.flyTo([vehicle.lastLocation.lat, vehicle.lastLocation.lon], 16, {
          duration: 1.5
        });
      }
    }
  }, [focusId, vehicles, map]);

  return null;
};

export const MapScreen: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const focusId = searchParams.get('focus');

  const fetchVehicles = async () => {
    const data = await api.fleet.getVehicles();
    setVehicles(data);
    setFilteredVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filterType === 'all') setFilteredVehicles(vehicles);
    else if (filterType === 'risky') setFilteredVehicles(vehicles.filter(v => v.healthScore < 40));
    else if (filterType === 'overdue') setFilteredVehicles(vehicles.filter(v => v.maintenance.dueState === 'overdue'));
    else setFilteredVehicles(vehicles.filter(v => v.status === filterType));
  }, [filterType, vehicles]);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading tactical map...</div>;

  return (
    <div className="h-full flex flex-col gap-4 relative">
      <style>
        {`
          @keyframes marker-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(3.5); opacity: 0; }
          }
        `}
      </style>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Live Operations Map</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchVehicles}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-600 shadow-sm transition-all"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden shadow-inner relative z-0 border border-gray-200">
        <MapContainer center={[17.0151, 54.0924]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapFocusHandler vehicles={vehicles} focusId={focusId} />
          {filteredVehicles.map(v => (
            <Marker 
              key={v.id} 
              position={[v.lastLocation.lat, v.lastLocation.lon]}
              icon={v.healthScore < 40 ? icons.risky : (icons[v.status] || icons.active)}
              eventHandlers={{
                add: (e) => {
                  if (v.id === focusId) {
                    e.target.openPopup();
                  }
                }
              }}
            >
              <Popup>
                <div className="p-1 w-48">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{v.assetCode}</h3>
                    <HealthScoreBadge score={v.healthScore} />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{v.make} {v.model}</p>
                  <div className="flex flex-col gap-2">
                    <VehicleStatusChip status={v.status} />
                    <MaintenanceDueBadge state={v.maintenance.dueState} />
                  </div>
                  <button 
                    onClick={() => navigate(`/app/vehicle/${v.id}`)}
                    className="mt-3 w-full py-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Open Profile
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Filters */}
        <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-1.5 w-52">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
            <Filter size={14} /> Filters
          </div>
          {[
            { id: 'all', label: `All Units (${vehicles.length})` },
            { id: 'active', label: 'Active Service' },
            { id: 'risky', label: 'High Risk' },
            { id: 'overdue', label: 'Overdue Cycle' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterType === f.id ? 'bg-amber-500 text-slate-900' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
