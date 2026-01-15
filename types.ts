
export type VehicleStatus = 'active' | 'idle' | 'offline';
export type DueState = 'ok' | 'due_soon' | 'overdue';
export type AlertSeverity = 'low' | 'med' | 'high';
export type AlertStatus = 'open' | 'acked' | 'closed';
export type WorkOrderStatus = 'open' | 'in_progress' | 'closed';

export interface Location {
  lat: number;
  lon: number;
}

export interface Vehicle {
  id: string;
  assetCode: string;
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: VehicleStatus;
  healthScore: number;
  lastUpdate: string;
  lastLocation: Location;
  odometerKm: number | null;
  engineHours: number | null;
  maintenance: {
    dueState: DueState;
    nextDueAt: string;
    nextDueEngineHours: number | null;
  };
  openAlertsCount: number;
}

export interface TelemetryEvent {
  id: string;
  vehicleId: string;
  timestamp: string;
  lat: number;
  lon: number;
  speedKph: number;
  ignitionOn: boolean;
  engineHours: number;
  metrics: {
    coolantTempC: number;
    batteryV: number;
    idleMinutesSinceLast: number;
  };
}

export interface Alert {
  id: string;
  vehicleId?: string;
  shiftId?: string;
  createdAt: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  status: AlertStatus;
  recommendedAction?: string;
}

export interface WorkOrder {
  id: string;
  vehicleId: string;
  createdAt: string;
  status: WorkOrderStatus;
  category: string;
  description: string;
  parts: Array<{ name: string; qty: number; unitCost: number }>;
  costEstimate: number;
  downtimeHours: number;
}

export interface User {
  id: string;
  name: string;
  role: 'fleet_manager' | 'ops_manager' | 'admin';
  org: string;
}

// --- Teams Management Types ---

export type ShiftStatus = 'planned' | 'active' | 'done' | 'missed';
export type TaskStatus = 'todo' | 'done' | 'blocked';
export type UpdateType = 'checkin' | 'progress' | 'blocker' | 'checkout';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: 'active' | 'completed';
}

export interface Site {
  id: string;
  projectId: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Team {
  id: string;
  name: string;
  leaderName: string;
  defaultHeadcount: number;
}

export interface Shift {
  id: string;
  date: string;
  projectId: string;
  siteId: string;
  teamId: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  headcountPlanned: number;
  headcountActual?: number;
  status: ShiftStatus;
  lastUpdateAt: string;
}

export interface ShiftTask {
  id: string;
  shiftId: string;
  title: string;
  status: TaskStatus;
  notes?: string;
}

export interface ShiftUpdate {
  id: string;
  shiftId: string;
  createdAt: string;
  type: UpdateType;
  message: string;
  headcount?: number;
}

// --- Billing Types ---
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
}

// --- Tenders Types ---
export interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  authority: string;
  submissionDeadline: string;
  budgetRange: string;
  status: 'open' | 'bidding' | 'submitted' | 'awarded' | 'lost';
}
