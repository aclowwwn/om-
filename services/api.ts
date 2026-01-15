
import { Vehicle, Alert, WorkOrder, TelemetryEvent, User, Project, Site, Team, Shift, ShiftTask, ShiftUpdate, Invoice, Tender } from '../types';
import { 
  INITIAL_VEHICLES, 
  INITIAL_ALERTS, 
  INITIAL_WORK_ORDERS, 
  getTelemetry,
  INITIAL_PROJECTS,
  INITIAL_SITES,
  INITIAL_TEAMS,
  INITIAL_SHIFTS,
  INITIAL_TASKS,
  INITIAL_UPDATES,
  INITIAL_INVOICES,
  INITIAL_TENDERS
} from './mockData';

const STORAGE_KEYS = {
  VEHICLES: 'fleettrack_vehicles',
  ALERTS: 'fleettrack_alerts',
  WORK_ORDERS: 'fleettrack_workorders',
  USER: 'fleettrack_user',
  TOKEN: 'fleettrack_token',
  PROJECTS: 'siteops_projects',
  SITES: 'siteops_sites',
  TEAMS: 'siteops_teams',
  SHIFTS: 'siteops_shifts',
  TASKS: 'siteops_tasks',
  UPDATES: 'siteops_updates',
  INVOICES: 'billing_invoices',
  TENDERS: 'tenders_list'
};

const getStored = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStored = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const api = {
  auth: {
    login: async (email: string, pass: string): Promise<{ token: string; user: User }> => {
      const user: User = { id: 'u1', name: 'Faisal', role: 'ops_manager', org: 'om& Operations' };
      setStored(STORAGE_KEYS.USER, user);
      setStored(STORAGE_KEYS.TOKEN, 'bypassed_token');
      return { token: 'bypassed_token', user };
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },
    getCurrentUser: (): User | null => getStored(STORAGE_KEYS.USER, null),
    isAuthenticated: (): boolean => !!localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  fleet: {
    getVehicles: async (): Promise<Vehicle[]> => getStored(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES),
    getVehicle: async (id: string): Promise<Vehicle | undefined> => {
      const vehicles = await api.fleet.getVehicles();
      return vehicles.find(v => v.id === id);
    },
    getTelemetry: async (id: string): Promise<TelemetryEvent[]> => getTelemetry(id)
  },

  maintenance: {
    getQueue: async () => {
      const vehicles = await api.fleet.getVehicles();
      const wos = await api.maintenance.getWorkOrders();
      return {
        overdue: vehicles.filter(v => v.maintenance.dueState === 'overdue'),
        dueSoon: vehicles.filter(v => v.maintenance.dueState === 'due_soon'),
        highRisk: vehicles.filter(v => v.healthScore < 40),
        openWorkOrders: wos.filter(wo => wo.status !== 'closed')
      };
    },
    getWorkOrders: async (vehicleId?: string): Promise<WorkOrder[]> => {
      const wos = getStored(STORAGE_KEYS.WORK_ORDERS, INITIAL_WORK_ORDERS);
      return vehicleId ? wos.filter(wo => wo.vehicleId === vehicleId) : wos;
    },
    createWorkOrder: async (wo: Partial<WorkOrder>): Promise<WorkOrder> => {
      const wos = await api.maintenance.getWorkOrders();
      const newWo: WorkOrder = {
        id: `wo_${Date.now()}`,
        vehicleId: wo.vehicleId!,
        createdAt: new Date().toISOString(),
        status: 'open',
        category: wo.category || 'general',
        description: wo.description || '',
        parts: [],
        costEstimate: 0,
        downtimeHours: 0,
        ...wo
      };
      setStored(STORAGE_KEYS.WORK_ORDERS, [...wos, newWo]);
      return newWo;
    },
    updateWorkOrderStatus: async (id: string, status: WorkOrder['status']): Promise<WorkOrder> => {
      const wos = await api.maintenance.getWorkOrders();
      const updated = wos.map(wo => wo.id === id ? { ...wo, status } : wo);
      setStored(STORAGE_KEYS.WORK_ORDERS, updated);
      return updated.find(wo => wo.id === id)!;
    }
  },

  alerts: {
    getAlerts: async (status?: string): Promise<Alert[]> => {
      const alerts = getStored(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
      return status ? alerts.filter(a => a.status === status) : alerts;
    },
    updateStatus: async (id: string, status: Alert['status']): Promise<Alert> => {
      const alerts = await api.alerts.getAlerts();
      const updated = alerts.map(a => a.id === id ? { ...a, status } : a);
      setStored(STORAGE_KEYS.ALERTS, updated);
      return updated.find(a => a.id === id)!;
    }
  },

  projects: {
    getAll: async (): Promise<Project[]> => getStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
    getSites: async (projectId?: string): Promise<Site[]> => {
      const sites = getStored(STORAGE_KEYS.SITES, INITIAL_SITES);
      return projectId ? sites.filter(s => s.projectId === projectId) : sites;
    },
    getSite: async (id: string): Promise<Site | undefined> => {
      const sites = await api.projects.getSites();
      return sites.find(s => s.id === id);
    }
  },

  teams: {
    getAll: async (): Promise<Team[]> => getStored(STORAGE_KEYS.TEAMS, INITIAL_TEAMS),
    getById: async (id: string): Promise<Team | undefined> => {
      const teams = await api.teams.getAll();
      return teams.find(t => t.id === id);
    }
  },

  shifts: {
    getByDate: async (date: string): Promise<Shift[]> => {
      const shifts = getStored(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS);
      return shifts.filter(s => s.date === date);
    },
    getById: async (id: string): Promise<Shift | undefined> => {
      const shifts = getStored<Shift[]>(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS);
      return shifts.find(s => s.id === id);
    },
    create: async (shift: Partial<Shift>): Promise<Shift> => {
      const shifts = getStored<Shift[]>(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS);
      const newShift: Shift = {
        id: `sh_${Date.now()}`,
        date: shift.date!,
        projectId: shift.projectId!,
        siteId: shift.siteId!,
        teamId: shift.teamId!,
        plannedStart: shift.plannedStart!,
        plannedEnd: shift.plannedEnd!,
        headcountPlanned: shift.headcountPlanned || 0,
        status: 'planned',
        lastUpdateAt: new Date().toISOString()
      };
      setStored(STORAGE_KEYS.SHIFTS, [...shifts, newShift]);
      return newShift;
    },
    update: async (id: string, updates: Partial<Shift>): Promise<Shift> => {
      const shifts = getStored<Shift[]>(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS);
      const updated = shifts.map(s => s.id === id ? { ...s, ...updates, lastUpdateAt: new Date().toISOString() } : s);
      setStored(STORAGE_KEYS.SHIFTS, updated);
      return updated.find(s => s.id === id)!;
    },
    getTasks: async (shiftId: string): Promise<ShiftTask[]> => {
      const tasks = getStored(STORAGE_KEYS.TASKS, INITIAL_TASKS);
      return tasks.filter(t => t.shiftId === shiftId);
    },
    updateTaskStatus: async (taskId: string, status: ShiftTask['status']): Promise<ShiftTask> => {
      const tasks = getStored<ShiftTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
      const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
      setStored(STORAGE_KEYS.TASKS, updated);
      return updated.find(t => t.id === taskId)!;
    },
    getUpdates: async (shiftId: string): Promise<ShiftUpdate[]> => {
      const updates = getStored(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
      return updates.filter(u => u.shiftId === shiftId);
    },
    addUpdate: async (update: Partial<ShiftUpdate>): Promise<ShiftUpdate> => {
      const updates = getStored<ShiftUpdate[]>(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
      const newUp: ShiftUpdate = {
        id: `up_${Date.now()}`,
        shiftId: update.shiftId!,
        createdAt: new Date().toISOString(),
        type: update.type!,
        message: update.message!,
        headcount: update.headcount
      };
      setStored(STORAGE_KEYS.UPDATES, [...updates, newUp]);
      return newUp;
    }
  },

  billing: {
    getInvoices: async (): Promise<Invoice[]> => getStored(STORAGE_KEYS.INVOICES, INITIAL_INVOICES)
  },

  tenders: {
    getTenders: async (): Promise<Tender[]> => getStored(STORAGE_KEYS.TENDERS, INITIAL_TENDERS)
  }
};
