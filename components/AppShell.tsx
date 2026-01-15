
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Truck, 
  Wrench, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Search,
  User as UserIcon,
  Calendar,
  Users,
  Briefcase,
  FileText,
  Grid2X2,
  ChevronLeft,
  Receipt,
  Gavel,
  History,
  CreditCard,
  Target
} from 'lucide-react';
import { api } from '../services/api';

const FLEET_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { label: 'Map', icon: MapIcon, path: '/app/map' },
  { label: 'Fleet', icon: Truck, path: '/app/fleet' },
  { label: 'Maintenance', icon: Wrench, path: '/app/maintenance' },
  { label: 'Alerts', icon: Bell, path: '/app/alerts' },
  { label: 'Admin', icon: Settings, path: '/app/admin/integrations' }
];

const TEAMS_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/teams/dashboard' },
  { label: 'Daily Plan', icon: Calendar, path: '/app/teams/plan' },
  { label: 'Projects', icon: Briefcase, path: '/app/teams/projects' },
  { label: 'Teams', icon: Users, path: '/app/teams/teams' },
  { label: 'Reports', icon: FileText, path: '/app/teams/reports' }
];

const BILLING_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/billing/dashboard' },
  { label: 'Invoices', icon: Receipt, path: '/app/billing/invoices' },
  { label: 'Payments', icon: CreditCard, path: '/app/billing/payments' },
  { label: 'Audit Trail', icon: History, path: '/app/billing/audit' }
];

const TENDERS_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/tenders/dashboard' },
  { label: 'Marketplace', icon: Target, path: '/app/tenders/market' },
  { label: 'My Bids', icon: Gavel, path: '/app/tenders/bids' },
  { label: 'Contracts', icon: Briefcase, path: '/app/tenders/contracts' }
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = api.auth.getCurrentUser();

  const isLaunchpad = location.pathname === '/app/dashboard';
  const isTeamsModule = location.pathname.includes('/teams/');
  const isBillingModule = location.pathname.includes('/billing/');
  const isTendersModule = location.pathname.includes('/tenders/');

  let currentNav = FLEET_NAV;
  let themeBg = 'bg-amber-500';
  let moduleName = 'FleetTrack AI';

  if (isTeamsModule) {
    currentNav = TEAMS_NAV;
    themeBg = 'bg-emerald-500';
    moduleName = 'SiteOps Tactical';
  } else if (isBillingModule) {
    currentNav = BILLING_NAV;
    themeBg = 'bg-sky-500';
    moduleName = 'Finance Core';
  } else if (isTendersModule) {
    currentNav = TENDERS_NAV;
    themeBg = 'bg-indigo-500';
    moduleName = 'ProcureWise';
  }

  const handleLogout = () => {
    api.auth.logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-6 border-b border-slate-800 mb-2 flex items-center justify-between">
        <Link to="/app/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className={`w-12 h-12 ${themeBg} rounded-lg flex items-center justify-center font-bold text-slate-900`}>om&</div>
        </Link>
        <button 
          onClick={() => navigate('/app/dashboard')}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors group"
          title="Switch Module"
        >
          <Grid2X2 size={20} />
        </button>
      </div>

      <div className="px-4 py-2">
        <button 
          onClick={() => navigate('/app/dashboard')}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-slate-800 transition-all border border-slate-800/50 mb-4"
        >
          <ChevronLeft size={14} /> Switch Apps
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {currentNav.map((item) => {
          const isActive = location.pathname === item.path;
          if (item.path === '/app/dashboard' && location.pathname !== '/app/dashboard') return null;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? `${themeBg} text-slate-900 font-semibold shadow-lg shadow-black/20` : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {!isLaunchpad && (
        <aside className="hidden md:block transition-all duration-300 w-64 shrink-0">
          <SidebarContent />
        </aside>
      )}

      {!isLaunchpad && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-slate-900">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            {!isLaunchpad && (
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 border px-2 py-1 rounded">
              {isLaunchpad ? 'om& Unified Hub' : moduleName}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLaunchpad && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
            {!isLaunchpad && (
              <button 
                onClick={() => navigate('/app/dashboard')}
                className="sm:hidden p-2 text-slate-400"
              >
                <Grid2X2 size={20} />
              </button>
            )}
            <div className="text-right hidden sm:block border-l pl-4 border-gray-100">
              <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{user?.org}</p>
            </div>
            <div className={`w-10 h-10 ${themeBg} text-slate-900 rounded-xl border border-black/5 flex items-center justify-center`}>
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-auto ${isLaunchpad ? 'p-0' : 'p-6'} text-gray-800`}>
          {children}
        </main>
      </div>
    </div>
  );
};
