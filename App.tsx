
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { MapScreen } from './screens/MapScreen';
import { FleetScreen } from './screens/FleetScreen';
import { VehicleDetailScreen } from './screens/VehicleDetailScreen';
import { MaintenanceQueueScreen } from './screens/MaintenanceQueueScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { AdminScreen } from './screens/AdminScreen';
import { LaunchpadScreen } from './screens/LaunchpadScreen';
import { TeamsDashboardScreen } from './screens/teams/TeamsDashboardScreen';
import { TeamsPlanScreen } from './screens/teams/TeamsPlanScreen';
import { ShiftDetailScreen } from './screens/teams/ShiftDetailScreen';
import { TeamsProjectsScreen } from './screens/teams/TeamsProjectsScreen';
import { TeamsListScreen } from './screens/teams/TeamsListScreen';
import { TeamsReportsScreen } from './screens/teams/TeamsReportsScreen';
import { BillingDashboardScreen } from './screens/billing/BillingDashboardScreen';
import { TendersDashboardScreen } from './screens/tenders/TendersDashboardScreen';
import { api } from './services/api';
import { LanguageProvider } from './services/i18n';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = api.auth.isAuthenticated();
  return auth ? <AppShell>{children}</AppShell> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          
          <Route path="/app/dashboard" element={<PrivateRoute><LaunchpadScreen /></PrivateRoute>} />
          
          {/* Fleet Management Routes */}
          <Route path="/app/map" element={<PrivateRoute><MapScreen /></PrivateRoute>} />
          <Route path="/app/fleet" element={<PrivateRoute><FleetScreen /></PrivateRoute>} />
          <Route path="/app/vehicle/:vehicleId" element={<PrivateRoute><VehicleDetailScreen /></PrivateRoute>} />
          <Route path="/app/maintenance" element={<PrivateRoute><MaintenanceQueueScreen /></PrivateRoute>} />
          <Route path="/app/alerts" element={<PrivateRoute><AlertsScreen /></PrivateRoute>} />
          <Route path="/app/admin/integrations" element={<PrivateRoute><AdminScreen /></PrivateRoute>} />

          {/* Teams Management Routes */}
          <Route path="/app/teams/dashboard" element={<PrivateRoute><TeamsDashboardScreen /></PrivateRoute>} />
          <Route path="/app/teams/plan" element={<PrivateRoute><TeamsPlanScreen /></PrivateRoute>} />
          <Route path="/app/teams/shifts/:shiftId" element={<PrivateRoute><ShiftDetailScreen /></PrivateRoute>} />
          <Route path="/app/teams/projects" element={<PrivateRoute><TeamsProjectsScreen /></PrivateRoute>} />
          <Route path="/app/teams/teams" element={<PrivateRoute><TeamsListScreen /></PrivateRoute>} />
          <Route path="/app/teams/reports" element={<PrivateRoute><TeamsReportsScreen /></PrivateRoute>} />

          {/* Billing Module */}
          <Route path="/app/billing/dashboard" element={<PrivateRoute><BillingDashboardScreen /></PrivateRoute>} />

          {/* Tenders Module */}
          <Route path="/app/tenders/dashboard" element={<PrivateRoute><TendersDashboardScreen /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/app/dashboard" />} />
          <Route path="*" element={<Navigate to="/app/dashboard" />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
