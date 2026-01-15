
import { Vehicle, Alert, WorkOrder, TelemetryEvent, Project, Site, Team, Shift, ShiftTask, ShiftUpdate, Invoice, Tender } from '../types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "veh_001",
    assetCode: "AKT-EX-17",
    plate: "OM-12345",
    vin: "VIN1234567890",
    make: "CAT",
    model: "320D",
    year: 2019,
    type: "excavator",
    status: "active",
    healthScore: 42,
    lastUpdate: "2026-01-06T08:41:00Z",
    lastLocation: { lat: 17.0151, lon: 54.0924 },
    odometerKm: null,
    engineHours: 6821,
    maintenance: {
      dueState: "due_soon",
      nextDueAt: "2026-01-13T00:00:00Z",
      nextDueEngineHours: 6900
    },
    openAlertsCount: 2
  },
  {
    id: "veh_002",
    assetCode: "AKT-TK-04",
    plate: "OM-77881",
    vin: "VIN0000000004",
    make: "Hino",
    model: "500",
    year: 2021,
    type: "tipper_truck",
    status: "idle",
    healthScore: 76,
    lastUpdate: "2026-01-06T08:39:00Z",
    lastLocation: { lat: 17.0250, lon: 54.1050 },
    odometerKm: 148220,
    engineHours: null,
    maintenance: {
      dueState: "ok",
      nextDueAt: "2026-02-02T00:00:00Z",
      nextDueEngineHours: null
    },
    openAlertsCount: 0
  },
  {
    id: "veh_003",
    assetCode: "AKT-WT-09",
    plate: "OM-55110",
    vin: "VIN0000000009",
    make: "Isuzu",
    model: "FTR",
    year: 2018,
    type: "water_tanker",
    status: "offline",
    healthScore: 33,
    lastUpdate: "2026-01-05T23:10:00Z",
    lastLocation: { lat: 16.9950, lon: 54.0800 },
    odometerKm: 205880,
    engineHours: null,
    maintenance: {
      dueState: "overdue",
      nextDueAt: "2025-12-28T00:00:00Z",
      nextDueEngineHours: null
    },
    openAlertsCount: 3
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: "al_7007",
    vehicleId: "veh_001",
    createdAt: "2026-01-06T07:30:00Z",
    type: "OVERHEAT_EVENT",
    severity: "high",
    title: "Overheat event detected",
    description: "Coolant temp exceeded 105°C for 4 minutes.",
    status: "open",
    recommendedAction: "Check coolant level, radiator fan, and schedule inspection within 24h."
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo_1002",
    vehicleId: "veh_001",
    createdAt: "2026-01-04T10:15:00Z",
    status: "open",
    category: "hydraulics",
    description: "Hydraulic response lag; inspect filters and lines.",
    parts: [{ name: "Hydraulic filter", qty: 1, unitCost: 18.0 }],
    costEstimate: 120.0,
    downtimeHours: 0
  }
];

export const getTelemetry = (vehicleId: string): TelemetryEvent[] => {
  const now = new Date();
  return Array.from({ length: 20 }, (_, i) => ({
    id: `tel_${vehicleId}_${i}`,
    vehicleId,
    timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
    lat: 17.0151 + (Math.random() - 0.5) * 0.05,
    lon: 54.0924 + (Math.random() - 0.5) * 0.05,
    speedKph: Math.floor(Math.random() * 80),
    ignitionOn: Math.random() > 0.2,
    engineHours: 6821 + (20 - i) * 1.5,
    metrics: {
      coolantTempC: 85 + Math.random() * 20,
      batteryV: 11.5 + Math.random() * 2,
      idleMinutesSinceLast: Math.floor(Math.random() * 15)
    }
  }));
};

export const INITIAL_PROJECTS: Project[] = [
  { id: 'p_1', name: 'Muscat Road Rehab', clientName: 'Ministry of Transport', status: 'active' },
  { id: 'p_2', name: 'Sohar Yard Expansion', clientName: 'Logistics SAOC', status: 'active' }
];

export const INITIAL_SITES: Site[] = [
  { id: 's_1', projectId: 'p_1', name: 'Al Khuwair Section 1', lat: 23.588, lon: 58.406 },
  { id: 's_2', projectId: 'p_1', name: 'Al Ghubrah Section 2', lat: 23.595, lon: 58.380 },
  { id: 's_3', projectId: 'p_2', name: 'Zone A - Primary Yard', lat: 24.350, lon: 56.740 }
];

export const INITIAL_TEAMS: Team[] = [
  { id: 't_1', name: 'Asphalt Crew A', leaderName: 'Ali Al-Said', defaultHeadcount: 8 },
  { id: 't_2', name: 'Earthworks Crew B', leaderName: 'Hassan Juma', defaultHeadcount: 12 },
  { id: 't_3', name: 'Marking & Finishing', leaderName: 'Omar Fahad', defaultHeadcount: 4 }
];

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 'sh_1',
    date: new Date().toISOString().split('T')[0],
    projectId: 'p_1',
    siteId: 's_1',
    teamId: 't_1',
    plannedStart: '06:00',
    plannedEnd: '14:00',
    actualStart: '06:05',
    headcountPlanned: 8,
    headcountActual: 7,
    status: 'active',
    lastUpdateAt: new Date().toISOString()
  }
];

export const INITIAL_TASKS: ShiftTask[] = [
  { id: 'tk_1', shiftId: 'sh_1', title: 'Milling Phase 1', status: 'done' },
  { id: 'tk_2', shiftId: 'sh_1', title: 'Asphalt Laying', status: 'todo' }
];

export const INITIAL_UPDATES: ShiftUpdate[] = [
  { id: 'up_1', shiftId: 'sh_1', createdAt: new Date().toISOString(), type: 'checkin', message: 'Arrived on site. Weather clear.', headcount: 7 }
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 'inv_001', invoiceNumber: 'INV-2026-001', clientName: 'Ministry of Transport', issueDate: '2026-01-01', dueDate: '2026-01-15', amount: 12500.50, status: 'paid' },
  { id: 'inv_002', invoiceNumber: 'INV-2026-002', clientName: 'Logistics SAOC', issueDate: '2026-01-05', dueDate: '2026-01-20', amount: 4800.00, status: 'pending' },
  { id: 'inv_003', invoiceNumber: 'INV-2026-003', clientName: 'PDO Oman', issueDate: '2025-12-15', dueDate: '2025-12-30', amount: 9200.75, status: 'overdue' }
];

export const INITIAL_TENDERS: Tender[] = [
  { id: 'tnd_001', referenceNumber: 'T-2026-DXB-04', title: 'Coastal Highway Expansion Ph. 3', authority: 'Public Works Authority', submissionDeadline: '2026-02-15', budgetRange: '5M - 8M OMR', status: 'bidding' },
  { id: 'tnd_002', referenceNumber: 'T-2026-SLL-11', title: 'Salalah Port Pavement Upgrade', authority: 'Port of Salalah', submissionDeadline: '2026-01-25', budgetRange: '1.2M OMR', status: 'open' },
  { id: 'tnd_003', referenceNumber: 'T-2025-MCT-88', title: 'Internal Road Network Rehab', authority: 'Muscat Municipality', submissionDeadline: '2025-12-10', budgetRange: '3M OMR', status: 'submitted' }
];
